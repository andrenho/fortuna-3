package com.fortuna3.service;

import org.springframework.stereotype.Service;

@Service
public class RemoteService {

    public String reset(String remoteIp) {
        return "Request successful";
    }


    public String uploadBios(String remoteIp) {
        return "";
    }

    public String uploadFirmware(String remoteIp) {
        return "";
    }

    public String uploadAllProjects(String remoteIp) {
        return "";
    }

    public String uploadProject(String remoteIp, String projectName) {
        return "";
    }
}
