package com.fortuna3.restcontroller;

import com.fortuna3.service.RemoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RemoteRestController {

    private final RemoteService remoteService;

    @PostMapping(value = "/remote/reset", produces = "text/plain")
    public String reset() {
        return remoteService.reset();
    }

    @PostMapping(value = "/remote/upload-bios", produces = "text/plain")
    public String uploadBios() {
        return remoteService.uploadBios();
    }

    @PostMapping(value = "/remote/upload-firmware", produces = "text/plain")
    public String uploadFirmware() {
        return remoteService.uploadFirmware();
    }

    @PostMapping(value = "/remote/upload-projects", produces = "text/plain")
    public String uploadAllProjects() {
        return remoteService.uploadAllProjects();
    }

    @PostMapping(value = "/remote/upload-project/{projectName}", produces = "text/plain")
    public String uploadProject(@PathVariable String projectName) {
        return remoteService.uploadProject(projectName);
    }
}
