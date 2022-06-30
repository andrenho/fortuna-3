package com.fortuna3.fortuna3.compiler;

import com.fortuna3.fortuna3.output.DebuggingInfoDTO;
import com.fortuna3.fortuna3.output.OutputMapper;
import com.fortuna3.fortuna3.output.SourceProjectDTO;
import com.fortuna3.fortuna3.projectfile.ProjectFileDTO;
import com.fortuna3.fortuna3.projectfile.ProjectFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class CompilerService {

    @Autowired
    private ProjectFileService projectFileService;

    @Autowired
    private OutputMapper outputMapper;

    @Autowired
    private CompilerMapper compilerMapper;

    @Autowired
    private CompilerExecutableService compilerExecutableService;

    private DebuggingInfoDTO currentDebuggingInfo;

    @Scheduled(fixedRate = 1000)
    public void runVerification() {

        currentDebuggingInfo = compileAllFiles();
    }

    private DebuggingInfoDTO compileAllFiles() {

        ProjectFileDTO projectFile = projectFileService.getProjectFile();
        String path = projectFileService.getProjectFilePath();

        record SourceProjectIndex(String name, SourceProjectDTO sourceProject) {}

        List<CompletableFuture<SourceProjectIndex>> futures = new ArrayList<>();
        if (projectFile.getBiosSource() != null)
            futures.add(CompletableFuture.supplyAsync(() -> new SourceProjectIndex("bios", compile(path + "/" + projectFile.getBiosSource()))));

        Map<String, SourceProjectDTO> projects = futures
                .stream().map(CompletableFuture::join).toList()
                .stream().collect(Collectors.toMap(SourceProjectIndex::name, SourceProjectIndex::sourceProject));
        return outputMapper.mapSourceProjectsToDebuggingInfo(projects);
    }

    private SourceProjectDTO compile(String biosSource) {

        RawCompilerOutputDTO rawCompilerOutputDTO = runCompiler(biosSource);
        return compilerMapper.mapRawToSourceProject(rawCompilerOutputDTO);
    }

    private RawCompilerOutputDTO runCompiler(String mainSourceFile) {

        RawCompilerOutputDTO rawCompilerOutput = new RawCompilerOutputDTO();

        String commandLine =
                compilerExecutableService.getCompilerPath() +
                " -chklabels -L listing.txt -Llo -nosym -x -Fbin -o rom.bin " +
                mainSourceFile;

        try {
            Process process = Runtime.getRuntime().exec(commandLine);

            rawCompilerOutput.setMainSourceFile(Path.of(mainSourceFile).getFileName().toString());
            rawCompilerOutput.setCompilerOutput(getOutput(process.getInputStream()));
            rawCompilerOutput.setCompilerError(getOutput(process.getErrorStream()));
            rawCompilerOutput.setStatus(process.waitFor());

            if (Files.exists(Path.of("listing.txt"))) {
                rawCompilerOutput.setListing(Files.readString(Path.of("listing.txt")));
                new File("listing.txt").delete();
            }
            if (Files.exists(Path.of("rom.bin"))) {
                rawCompilerOutput.setRom(Files.readAllBytes(Path.of("rom.bin")));
                new File("rom.bin").delete();
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }

        return rawCompilerOutput;
    }

    private String getOutput(InputStream inputStream) throws IOException {

        String s;
        List<String> lines = new ArrayList<>();
        try (BufferedReader output = new BufferedReader(new InputStreamReader(inputStream))) {
            while ((s = output.readLine()) != null)
                lines.add(s);
        }
        return String.join("\n", lines);
    }

    public DebuggingInfoDTO getCurrentDebuggingInfo() {
        return currentDebuggingInfo;
    }

    public Integer getHash() {

        if (currentDebuggingInfo != null)
            return currentDebuggingInfo.getHash();
        else
            return 0;
    }
}
