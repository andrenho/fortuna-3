package com.fortuna3.fortuna3;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.awt.*;
import java.net.URI;

@SpringBootApplication
@EnableScheduling
public class Fortuna3Application {

    public static void main(String[] args) {
        SpringApplication.run(Fortuna3Application.class, args);
    }

}
