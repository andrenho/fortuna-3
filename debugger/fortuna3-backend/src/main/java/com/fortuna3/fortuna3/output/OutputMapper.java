package com.fortuna3.fortuna3.output;

import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class OutputMapper {
    public DebuggingInfoDTO mapSourceProjectsToDebuggingInfo(Map<String, SourceProjectDTO> projects) {

        DebuggingInfoDTO debuggingInfo = new DebuggingInfoDTO();

        debuggingInfo.setSuccess(projects.values().stream().allMatch(SourceProjectDTO::isSuccess));
        if (debuggingInfo.isSuccess()) {

            debuggingInfo.setProjects(projects);
            debuggingInfo.setHash(Arrays.hashCode(projects.values().stream().map(SourceProjectDTO::getCrc).toArray()));
        } else {

            debuggingInfo.setErrorMessage(projects.values()
                            .stream().filter(SourceProjectDTO::isSuccess)
                            .map(SourceProjectDTO::getCompilerError)
                            .collect(Collectors.joining("\n")));
            debuggingInfo.setHash(debuggingInfo.getErrorMessage().hashCode());
        }

        return debuggingInfo;
    }
}
