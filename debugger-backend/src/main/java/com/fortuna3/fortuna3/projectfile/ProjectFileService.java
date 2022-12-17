package com.fortuna3.fortuna3.projectfile;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class ProjectFileService {

    @Value("${project-path}")
    private String projectPath;

    private final ApplicationContext appContext;

    private ProjectFileDTO projectFile;

    private void readConfigFile() throws IOException {
        var objectMapper = new ObjectMapper();
        objectMapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);
        try {
            projectFile = objectMapper.readValue(Paths.get(projectPath).toFile(), ProjectFileDTO.class);
        } catch (FileNotFoundException e) {
            SpringApplication.exit(appContext, () -> 1);
        }
    }

    public ProjectFileDTO getProjectFile() {
        try {
            readConfigFile();
        } catch (IOException e) {
            System.err.println(e.getMessage());
        }
        return projectFile;
    }

    public String getProjectFilePath() {
        return new File(projectPath).getParent();
    }
}
