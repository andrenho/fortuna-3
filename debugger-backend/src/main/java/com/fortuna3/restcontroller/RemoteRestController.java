package com.fortuna3.restcontroller;

import com.fortuna3.service.RemoteService;
import lombok.RequiredArgsConstructor;
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

    /*
    @PostMapping(value = "/remote/upload-bios", consumes = "application/octet-stream")
    public void uploadBios(InputStream dataStream) throws IOException {
        byte[] data = new byte[dataStream.available()];
        dataStream.read(data);
        remoteService.uploadBios(data);
    }

    @PostMapping("/remote/upload-firmware")
    public void uploadFirmware() {
        remoteService.uploadFirmware();
    }

    @PostMapping("/remote/format-sdcard")
    public void formatSdCard() {
        remoteService.formatSdCard();
    }

    @PostMapping(value = "/remote/upload-file/{filename}", consumes = "application/octet-stream")
    public void uploadFile(@PathVariable String filename, InputStream dataStream) throws IOException {
        byte[] data = new byte[dataStream.available()];
        dataStream.read(data);
        remoteService.uploadFile(filename, data);
    }
     */
}
