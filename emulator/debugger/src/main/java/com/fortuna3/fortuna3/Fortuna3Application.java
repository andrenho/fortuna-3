package com.fortuna3.fortuna3;

import com.fortuna3.fortuna3.sdcard.SDCardService;
import de.waldheinz.fs.util.RamDisk;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.io.IOException;

@SpringBootApplication
public class Fortuna3Application {

    public static void main(String[] args) {
        SpringApplication.run(Fortuna3Application.class, args);
    }

}
