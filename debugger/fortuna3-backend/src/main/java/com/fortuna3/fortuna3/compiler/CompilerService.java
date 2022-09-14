package com.fortuna3.fortuna3.compiler;

import com.fortuna3.fortuna3.output.DebuggingInfoDTO;
import com.fortuna3.fortuna3.output.OutputMapper;
import com.fortuna3.fortuna3.output.SourceProjectDTO;
import com.fortuna3.fortuna3.projectfile.ProjectDTO;
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
        for (Map.Entry<String, ProjectDTO> project: projectFile.projects().entrySet()) {
            futures.add(CompletableFuture.supplyAsync(() -> new SourceProjectIndex(
                    project.getKey(),
                    compile(path + "/" + project.getValue().source(), project.getValue().address()))));
        }

        Map<String, SourceProjectDTO> projects = futures
                .stream().map(CompletableFuture::join).toList()
                .stream().collect(Collectors.toMap(SourceProjectIndex::name, SourceProjectIndex::sourceProject));
        return outputMapper.mapSourceProjectsToDebuggingInfo(projects, projectFile.sdcard());
    }

    private SourceProjectDTO compile(String biosSource, Integer address) {

        RawCompilerOutputDTO rawCompilerOutputDTO = runCompiler(biosSource);
        return compilerMapper.mapRawToSourceProject(rawCompilerOutputDTO, address);
    }

    private RawCompilerOutputDTO runCompiler(String mainSourceFile) {

        String commandLine =
                compilerExecutableService.getCompilerPath() +
                " -chklabels -L listing.txt -Llo -nosym -x -Fbin -o rom.bin " +
                mainSourceFile;

        try {
            Process process = Runtime.getRuntime().exec(commandLine);
            int status = process.waitFor();

            String listing = null;
            if (Files.exists(Path.of("listing.txt"))) {
                listing = Files.readString(Path.of("listing.txt"));
                new File("listing.txt").delete();
            }

            byte[] rom = null;
            if (Files.exists(Path.of("rom.bin"))) {
                rom = Files.readAllBytes(Path.of("rom.bin"));
                new File("rom.bin").delete();
            }

            return RawCompilerOutputDTO.builder()
                    .mainSourceFile(Path.of(mainSourceFile).getFileName().toString())
                    .compilerOutput(getOutput(process.getInputStream()))
                    .compilerError(getOutput(process.getErrorStream()))
                    .status(status)
                    .listing(listing)
                    .rom(rom)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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
            return currentDebuggingInfo.hash();
        else
            return 0;
    }
}
