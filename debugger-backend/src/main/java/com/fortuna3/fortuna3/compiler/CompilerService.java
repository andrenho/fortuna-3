package com.fortuna3.fortuna3.compiler;

import com.fortuna3.fortuna3.output.DebuggingInfoDTO;
import com.fortuna3.fortuna3.output.OutputMapper;
import com.fortuna3.fortuna3.output.SourceProjectDTO;
import com.fortuna3.fortuna3.projectfile.ProjectDTO;
import com.fortuna3.fortuna3.projectfile.ProjectFileDTO;
import com.fortuna3.fortuna3.projectfile.ProjectFileService;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class CompilerService {

    private final ProjectFileService projectFileService;
    private final OutputMapper outputMapper;
    private final CompilerMapper compilerMapper;
    private final CompilerExecutableService compilerExecutableService;

    private DebuggingInfoDTO currentDebuggingInfo;

    @Scheduled(fixedRate = 1000)
    public void runVerification() {

        currentDebuggingInfo = compileAllFiles();
    }

    private DebuggingInfoDTO compileAllFiles() {

        var projectFile = projectFileService.getProjectFile();
        var path = projectFileService.getProjectFilePath();

        record SourceProjectIndex(String name, SourceProjectDTO sourceProject) {}

        var futures = new ArrayList<CompletableFuture<SourceProjectIndex>>();
        for (var project: projectFile.projects().entrySet()) {
            futures.add(CompletableFuture.supplyAsync(() -> new SourceProjectIndex(
                    project.getKey(),
                    compile(path + "/" + project.getValue().source(), project.getValue().address()))));
        }

        var projects = futures
                .stream().map(CompletableFuture::join).toList()
                .stream().collect(Collectors.toMap(SourceProjectIndex::name, SourceProjectIndex::sourceProject));
        return outputMapper.mapSourceProjectsToDebuggingInfo(projects, projectFile.sdcard());
    }

    private SourceProjectDTO compile(String biosSource, Integer address) {

        var rawCompilerOutputDTO = runCompiler(biosSource);
        return compilerMapper.mapRawToSourceProject(rawCompilerOutputDTO, address);
    }

    private RawCompilerOutputDTO runCompiler(String mainSourceFile) {

        final String LISTING_FILENAME = "listing.txt";
        final String ROM_FILENAME = "rom.bin";

        var commandLine =
                compilerExecutableService.getCompilerPath() +
                " -chklabels -L listing.txt -Llo -nosym -x -Fbin -o rom.bin -I" + compilerExecutableService.getIncludeFilePath() + " " +
                mainSourceFile;

        try {
            Process process = Runtime.getRuntime().exec(commandLine);
            int status = process.waitFor();

            String listing = null;
            if (Files.exists(Path.of(LISTING_FILENAME))) {
                listing = Files.readString(Path.of(LISTING_FILENAME));
                new File(LISTING_FILENAME).delete();
            }

            byte[] rom = null;
            if (Files.exists(Path.of(ROM_FILENAME))) {
                rom = Files.readAllBytes(Path.of(ROM_FILENAME));
                new File(ROM_FILENAME).delete();
            }

            if (status == 0) {
                return RawCompilerOutputDTO.builder()
                        .mainSourceFile(Path.of(mainSourceFile).getFileName().toString())
                        .compilerOutput(getOutput(process.getInputStream()))
                        .status(status)
                        .listing(listing)
                        .rom(rom)
                        .build();
            } else {
                return RawCompilerOutputDTO.builder()
                        .mainSourceFile(Path.of(mainSourceFile).getFileName().toString())
                        .compilerError(getOutput(process.getErrorStream()))
                        .status(status)
                        .build();
            }

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private String getOutput(InputStream inputStream) throws IOException {

        String s;
        var lines = new ArrayList<String>();
        try (var output = new BufferedReader(new InputStreamReader(inputStream))) {
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
