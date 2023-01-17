package com.fortuna3.projectfile.dto;

import java.util.Map;

public record ProjectFile(
        SDCardDTO sdcard,
        String biosSource,
        Map<String, ProjectDTO> projects
) {
    public record SDCardDTO(
            int sizeInMB
    ) {}
    public record ProjectDTO(
            String source,
            Integer address
    ) {}
}
