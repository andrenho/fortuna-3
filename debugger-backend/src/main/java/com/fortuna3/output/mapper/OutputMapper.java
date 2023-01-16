package com.fortuna3.output.mapper;

import com.fortuna3.output.dto.DebuggingInfo;
import com.fortuna3.output.dto.SourceProject;
import com.fortuna3.projectfile.dto.ProjectFile;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.stream.Collectors;

@Component
public class OutputMapper {

    public DebuggingInfo mapSourceProjectsToDebuggingInfo(Map<String, SourceProject> projects, ProjectFile.SDCardDTO sdcard) {

        var isSuccess = projects.values().stream().allMatch(SourceProject::isSuccess);
        if (isSuccess) {

            return DebuggingInfo.builder()
                            .success(isSuccess)
                            .projects(projects)
                            .sdCardSizeInMB(sdcard.sizeInMB())
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
