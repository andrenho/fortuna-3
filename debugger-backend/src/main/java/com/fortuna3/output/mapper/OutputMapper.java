package com.fortuna3.output.mapper;

import com.fortuna3.output.dto.DebuggingInfo;
import com.fortuna3.output.dto.SourceProject;
import com.fortuna3.projectfile.dto.DebuggerSetup;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class OutputMapper {

    public DebuggingInfo mapSourceProjectsToDebuggingInfo(Map<String, SourceProject> projects, DebuggerSetup debuggerSetup) {

        var isSuccess = projects.values().stream().allMatch(SourceProject::isSuccess);
        if (isSuccess) {

            return DebuggingInfo.builder()
                            .success(isSuccess)
                            .projects(projects)
                            .debuggerSetup(debuggerSetup)
                            .build();
        } else {

            var errorMessage = projects.values()
                    .stream().filter(p -> !p.isSuccess())
                    .map(SourceProject::getCompilerError)
                    .collect(Collectors.joining("\n"));
            return DebuggingInfo.builder()
                            .success(isSuccess)
                            .errorMessage(errorMessage)
                            .build();
        }
    }
}
