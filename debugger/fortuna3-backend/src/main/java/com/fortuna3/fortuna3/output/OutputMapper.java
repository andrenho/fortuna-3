package com.fortuna3.fortuna3.output;

import com.fortuna3.fortuna3.projectfile.ProjectFileDTO;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class OutputMapper {
    public DebuggingInfoDTO mapSourceProjectsToDebuggingInfo(Map<String, SourceProjectDTO> projects, ProjectFileDTO.SDCardDTO sdcard) {

        DebuggingInfoDTO debuggingInfo = new DebuggingInfoDTO();

        debuggingInfo.setSuccess(projects.values().stream().allMatch(SourceProjectDTO::isSuccess));
        if (debuggingInfo.isSuccess()) {

            debuggingInfo.setProjects(projects);
            debuggingInfo.setSdCardSizeInMB(sdcard.getSizeInMB());
        } else {

            debuggingInfo.setErrorMessage(projects.values()
                            .stream().filter(p -> !p.isSuccess())
                            .map(SourceProjectDTO::getCompilerError)
                            .collect(Collectors.joining("\n")));
        }

        return debuggingInfo;
    }
}
