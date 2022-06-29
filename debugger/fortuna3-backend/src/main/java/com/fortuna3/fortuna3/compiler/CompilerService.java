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
import java.util.concurrent.CompletableFuture;

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

        List<CompletableFuture<SourceProjectDTO>> futures = new ArrayList<>();
        if (projectFile.getBiosSource() != null)
            futures.add(CompletableFuture.supplyAsync(() -> compile(path + "/" + projectFile.getBiosSource())));

        List<SourceProjectDTO> compilerOutputs = futures.stream().map(CompletableFuture::join).toList();
        return outputMapper.mapSourceProjectsToDebuggingInfo(compilerOutputs);
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

            rawCompilerOutput.setCompilerOutput(getOutput(process.getInputStream()));
            rawCompilerOutput.setCompilerError(getOutput(process.getErrorStream()));
            rawCompilerOutput.setStatus(process.waitFor());
            rawCompilerOutput.setListing(Files.readString(Path.of("listing.txt")));
            rawCompilerOutput.setRom(Files.readAllBytes(Path.of("rom.bin")));

            new File("listing.txt").delete();
            new File("rom.bin").delete();

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

    public Integer getCrc() {

        if (currentDebuggingInfo != null)
            return currentDebuggingInfo.getCrc();
        else
            return 0;
    }
}
