package com.fortuna3.dto.projectfile;

import java.util.Map;

public record ProjectFileDTO(SDCardDTO sdcard, Map<String, ProjectDTO> projects) {
    public record SDCardDTO(int sizeInMB) {}
}
