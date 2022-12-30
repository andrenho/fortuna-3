package com.fortuna3.dto.projectfile;

import java.util.Map;

public record ProjectFileDTO(
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
