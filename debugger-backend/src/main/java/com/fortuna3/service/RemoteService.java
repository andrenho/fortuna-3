package com.fortuna3.service;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class RemoteService {

    private final CompilerService compilerService;

    private static final String PORT = "8026";

    public String reset(String remoteIp) {
        return remoteRequest(remoteIp, "reset");
    }

    public String uploadBios(String remoteIp) {
        return remoteRequest(remoteIp, "upload-bios", compilerService.getBiosBinary());
    }

    public String uploadFirmware(String remoteIp) {
        return remoteRequest(remoteIp, "upload-firmware");
    }

    public String uploadAllProjects(String remoteIp) {
        var sb = new StringBuilder();
        sb.append(remoteRequest(remoteIp, "format-sdcard"));
        for (var projectName: compilerService.getProjectNames())
            sb.append(remoteRequest(remoteIp, "create-file/" + projectName, compilerService.getProjectBinary(projectName)));
        return sb.toString();
    }

    public String uploadProject(String remoteIp, String projectName) {
        return remoteRequest(remoteIp, "create-file/" + projectName, compilerService.getProjectBinary(projectName));
    }

    private String remoteRequest(String remoteIp, String action) {
        return remoteRequest(remoteIp, action, null);
    }

    private String remoteRequest(String remoteIp, String action, byte[] payload) {
        final String uri = "http://" + remoteIp + ":" + PORT + "/" + action;

        var restTemplate = new RestTemplate();
        if (payload != null) {
            var requestEntity = RequestEntity.post(uri)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(payload);
            var response = restTemplate.exchange(requestEntity, String.class);
            return response.getBody();
        } else {
            return restTemplate.postForObject(uri, null, String.class);
        }
    }

}
