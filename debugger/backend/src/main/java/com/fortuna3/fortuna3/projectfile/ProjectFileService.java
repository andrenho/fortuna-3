package com.fortuna3.fortuna3.projectfile;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Paths;

@Service
public class ProjectFileService {

    @Value("${project-path}")
    private String projectPath;

    private ProjectFileDTO projectFile;

    @PostConstruct
    public void readConfigFile() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.enable(MapperFeature.ACCEPT_CASE_INSENSITIVE_ENUMS);
        projectFile = objectMapper.readValue(Paths.get(projectPath).toFile(), ProjectFileDTO.class);
    }

    public ProjectFileDTO getProjectFile() {
        return projectFile;
    }
}
