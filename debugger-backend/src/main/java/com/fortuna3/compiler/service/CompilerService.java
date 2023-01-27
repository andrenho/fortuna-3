package com.fortuna3.compiler.service;

import com.fortuna3.compiler.dto.RawCompilerOutput;
import com.fortuna3.compiler.mapper.CompilerMapper;
import com.fortuna3.output.dto.DebuggingInfo;
import com.fortuna3.output.dto.SourceProject;
import com.fortuna3.output.mapper.OutputMapper;
import com.fortuna3.projectfile.service.ProjectFileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Log
@Service
@RequiredArgsConstructor
public class CompilerService {

    private final ProjectFileService projectFileService;
    private final OutputMapper outputMapper;
    private final CompilerMapper compilerMapper;
    private final CompilerExecutableService compilerExecutableService;

    @Value("${keepListingTxt}")
    private Boolean keepListingTxt;

    private DebuggingInfo currentDebuggingInfo;

    public void recompileAllFiles() {

        var projectFile = projectFileService.getProjectFile();
        var path = projectFileService.getProjectFilePath();

        record SourceProjectIndex(String name, SourceProject sourceProject) {}

        var futures = new ArrayList<CompletableFuture<SourceProjectIndex>>();
        futures.add(CompletableFuture.supplyAsync(() -> new SourceProjectIndex("BIOS", compile(path + "/" + projectFile.biosSource(), 0))));

        for (var project: projectFile.projects().entrySet()) {
            futures.add(CompletableFuture.supplyAsync(() -> new SourceProjectIndex(
                    project.getKey(),
                    compile(path + "/" + project.getValue().source(), project.getValue().address()))));
        }

        var projects = futures
                .stream().map(CompletableFuture::join).toList()
                .stream().collect(Collectors.toMap(SourceProjectIndex::name, SourceProjectIndex::sourceProject));

        currentDebuggingInfo = outputMapper.mapSourceProjectsToDebuggingInfo(projects, projectFile.debuggerSetup());
    }

    private SourceProject compile(String mainSourceFile, Integer address) {

        var rawCompilerOutputDTO = runCompiler(mainSourceFile);
        return compilerMapper.mapRawToSourceProject(rawCompilerOutputDTO, address);
    }

    private RawCompilerOutput runCompiler(String mainSourceFile) {

        final String fileId = Paths.get(mainSourceFile).getFileName().toString();
        final String LISTING_FILENAME = System.getProperty("java.io.tmpdir") + "/" + fileId + "_listing.txt";
        final String ROM_FILENAME = System.getProperty("java.io.tmpdir") + "/" + fileId + "_rom.bin";

        var commandLine =
                compilerExecutableService.getCompilerPath() +
                " -chklabels -L " + LISTING_FILENAME + " -Llo -nosym -x -Fbin -o " + ROM_FILENAME + " -I" + compilerExecutableService.getIncludeFilePath() + " " +
                mainSourceFile;
        // log.info("Compiling with the following command line: " + commandLine);

        try {
            String listing = null;
            byte[] rom = null;

            Process process = Runtime.getRuntime().exec(commandLine);
            int status = process.waitFor();

            if (Files.exists(Path.of(LISTING_FILENAME))) {
                listing = Files.readString(Path.of(LISTING_FILENAME));
                if (Boolean.FALSE.equals(keepListingTxt))
                    new File(LISTING_FILENAME).delete();
            }

            if (Files.exists(Path.of(ROM_FILENAME))) {
                rom = Files.readAllBytes(Path.of(ROM_FILENAME));
                new File(ROM_FILENAME).delete();
            }

            if (status == 0) {
                if (listing == null)
                    log.warning("Listing is null");

                return RawCompilerOutput.builder()
                        .mainSourceFile(Path.of(mainSourceFile).getFileName().toString())
                        .compilerOutput(getOutput(process.getInputStream()))
                        .status(status)
                        .listing(listing)
                        .rom(rom)
                        .build();
            } else {
                var output = getOutput(process.getErrorStream());
                // log.warning("Compilation failed: " + output);
                return RawCompilerOutput.builder()
                        .mainSourceFile(Path.of(mainSourceFile).getFileName().toString())
                        .compilerError(output)
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

    public DebuggingInfo getCurrentDebuggingInfo() {
        return currentDebuggingInfo;
    }

    public Integer getHash() {

        if (currentDebuggingInfo != null)
            return currentDebuggingInfo.hash();
        else
            return 0;
    }

    public List<String> getProjectNames() {
        return new ArrayList<>(currentDebuggingInfo.projects().keySet());
    }

    public byte[] getBiosBinary() {
        return getProjectBinary("BIOS");
    }

    public byte[] getProjectBinary(String projectName) {
        return currentDebuggingInfo.projects().get(projectName).getBinary();
    }
}
