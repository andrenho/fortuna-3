package com.fortuna3.fortuna3.config;

import com.fortuna3.fortuna3.Fortuna3Application;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfigurationGuard implements InitializingBean {

    @Value("${project-path:#{null}}")
    private String projectPath;

    @Override
    public void afterPropertiesSet() {
        if (projectPath == null || projectPath.isEmpty()) {
            final String message = "--project-path=XXXX command line argument missing.";
            System.err.println(message);
            throw new IllegalArgumentException(message);
        }
    }
}
