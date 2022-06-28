package com.fortuna3.fortuna3.compiler;

import com.fortuna3.fortuna3.output.DebuggingInfoDTO;
import com.fortuna3.fortuna3.output.OutputMapper;
import com.fortuna3.fortuna3.projectfile.ProjectFileDTO;
import com.fortuna3.fortuna3.projectfile.ProjectFileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

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

    private DebuggingInfoDTO currentDebuggingInfo;

    @Scheduled(fixedRate = 1000)
    public void runVerification() {

        currentDebuggingInfo = compileAllFiles();
    }

    private DebuggingInfoDTO compileAllFiles() {

        ProjectFileDTO projectFile = projectFileService.getProjectFile();

        List<CompletableFuture<ParsedCompilerOutputDTO>> futures = new ArrayList<>();
        if (projectFile.getBiosSource() != null)
            futures.add(CompletableFuture.supplyAsync(() -> compile(projectFile.getBiosSource())));

        List<ParsedCompilerOutputDTO> compilerOutputs = futures.stream().map(CompletableFuture::join).toList();
        return outputMapper.mapCompilerOutputsToDebuggingInfo(compilerOutputs);
    }

    private ParsedCompilerOutputDTO compile(String biosSource) {

        RawCompilerOutputDTO rawCompilerOutputDTO = runCompiler(biosSource);
        return compilerMapper.mapRawToParsedCompilerOutput(rawCompilerOutputDTO);
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
