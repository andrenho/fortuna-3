package com.fortuna3.fortuna3.projectfile;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Paths;

@Service
public class ProjectFileService {

    @Value("${project-path}")
    private String projectPath;

    @Autowired
    private ApplicationContext appContext;

    private ProjectFileDTO projectFile;

    @PostConstruct
    public void readConfigFile() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);
        try {
            projectFile = objectMapper.readValue(Paths.get(projectPath).toFile(), ProjectFileDTO.class);
        } catch (FileNotFoundException e) {
            final String message = "File " + projectPath + " was not found.";
            SpringApplication.exit(appContext, () -> 1);
        }
    }

    public ProjectFileDTO getProjectFile() {
        return projectFile;
    }

    public String getProjectFilePath() {
        File file = new File(projectPath);
        return file.getParent();
    }
}
