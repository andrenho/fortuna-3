package com.fortuna3.mapper;

import com.fortuna3.dto.output.DebuggingInfoDTO;
import com.fortuna3.dto.output.SourceProjectDTO;
import com.fortuna3.dto.projectfile.ProjectFileDTO;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class OutputMapper {

    public DebuggingInfoDTO mapSourceProjectsToDebuggingInfo(Map<String, SourceProjectDTO> projects, ProjectFileDTO.SDCardDTO sdcard) {

        var isSuccess = projects.values().stream().allMatch(SourceProjectDTO::isSuccess);
        if (isSuccess) {

            return DebuggingInfoDTO.builder()
                            .success(isSuccess)
                            .projects(projects)
                            .sdCardSizeInMB(sdcard.sizeInMB())
                            .build();
        } else {

            var errorMessage = projects.values()
                    .stream().filter(p -> !p.isSuccess())
                    .map(SourceProjectDTO::getCompilerError)
                    .collect(Collectors.joining("\n"));
            return DebuggingInfoDTO.builder()
                            .success(isSuccess)
                            .errorMessage(errorMessage)
                            .build();
        }
    }
}
