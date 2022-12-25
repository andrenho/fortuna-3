package com.fortuna3.config;

import lombok.extern.java.Log;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;

@Log
@Configuration
public class ConfigurationGuard implements InitializingBean {

    @Value("${projectPath:#{null}}")
    private String projectPath;

    @Override
    public void afterPropertiesSet() {
        if (projectPath == null || projectPath.isEmpty()) {
            final String message = "-DprojectPath=XXXX command line argument missing.";
            log.severe(message);
            throw new IllegalArgumentException(message);
        } else {
            if (Files.notExists(Path.of(projectPath))) {
                final String message = "File " + projectPath + " was not found.";
                log.severe(message);
                throw new IllegalArgumentException(message);
            }
        }
    }
}