package com.fortuna3.fortuna3.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import java.awt.*;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

@Component
public class LifecycleConfig {

    @Value("server.port")
    private String port;

    @EventListener(ApplicationReadyEvent.class)
    public void applicationReadyEvent() throws URISyntaxException, IOException {
        browseTo("http://localhost:" + port + "/");
    }

    private void browseTo(String url) throws URISyntaxException, IOException {
        if(Desktop.isDesktopSupported()){
            Desktop.getDesktop().browse(new URI(url));
        } else {
            Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + url);
        }
    }

}
