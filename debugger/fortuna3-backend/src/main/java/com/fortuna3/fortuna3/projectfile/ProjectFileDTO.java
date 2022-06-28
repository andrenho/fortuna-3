package com.fortuna3.fortuna3.projectfile;

import lombok.Data;

@Data
public class ProjectFileDTO {

    @Data
    public static class SDCardDTO {
        private int sizeInMB;
    }

    private SDCardDTO sdcard;
    private String biosSource;

}
