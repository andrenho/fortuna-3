package com.fortuna3.service;

import org.springframework.stereotype.Service;

@Service
public class RemoteService {

    public String reset() {
        throw new RuntimeException("Reset failure");
    }

    public void uploadBios(byte[] data) {
    }

    public void uploadFirmware() {
    }

    public void formatSdCard() {
    }

    public void uploadFile(String filename, byte[] data) {
    }

}
