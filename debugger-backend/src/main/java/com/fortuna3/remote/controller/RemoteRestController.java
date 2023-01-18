package com.fortuna3.remote.controller;

import com.fortuna3.remote.service.RemoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RemoteRestController {

    private final RemoteService remoteService;

    @PostMapping(value = "/remote/{remoteIp}/reset", produces = "text/plain")
    public String reset(@PathVariable String remoteIp) {
        return remoteService.reset(remoteIp);
    }

    @PostMapping(value = "/remote/{remoteIp}/upload-bios", produces = "text/plain")
    public String uploadBios(@PathVariable String remoteIp) {
        return remoteService.uploadBios(remoteIp);
    }

    @PostMapping(value = "/remote/{remoteIp}/format-sdcard", produces = "text/plain")
    public String formatSDCard(@PathVariable String remoteIp) {
        return remoteService.formatSDCard(remoteIp);
    }

    @PostMapping(value = "/remote/{remoteIp}/upload-projects", produces = "text/plain")
    public String uploadAllProjects(@PathVariable String remoteIp) {
        return remoteService.uploadAllProjects(remoteIp);
    }

    @PostMapping(value = "/remote/{remoteIp}/upload-project/{projectName}", produces = "text/plain")
    public String uploadProject(@PathVariable String remoteIp, @PathVariable String projectName) {
        return remoteService.uploadProject(remoteIp, projectName);
    }

    @PostMapping(value = "/remote/{remoteIp}/clean-build", produces = "text/plain")
    public String cleanBuild(@PathVariable String remoteIp) {
        return remoteService.cleanBuild(remoteIp);
    }

    @PostMapping(value = "/remote/{remoteIp}/upload-firmware", produces = "text/plain")
    public String uploadFirmware(@PathVariable String remoteIp) {
        return remoteService.uploadFirmware(remoteIp);
    }

}
