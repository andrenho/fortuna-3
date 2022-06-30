package com.fortuna3.fortuna3.projectfile;

import lombok.Data;

import java.util.Map;

@Data
public class ProjectFileDTO {

    @Data
    public static class SDCardDTO {
        private int sizeInMB;
    }

    private SDCardDTO sdcard;
    private Map<String, ProjectDTO> projects;
}
