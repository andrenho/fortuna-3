package com.fortuna3.service;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fortuna3.dto.projectfile.ProjectFileDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Paths;

@Log
@Service
@RequiredArgsConstructor
public class ProjectFileService {

    @Value("${project-path}")
    private String projectPath;

    private final ApplicationContext appContext;

    private ProjectFileDTO projectFile;

    private void readConfigFile() throws IOException {
        var objectMapper = JsonMapper.builder()
                .configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS, true)
                .build();
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
            log.severe(e.getMessage());
        }
        return projectFile;
    }

    public String getProjectFilePath() {
        String parent = new File(projectPath).getParent();
        if (parent == null)
            parent = ".";
        return parent;
    }
}
