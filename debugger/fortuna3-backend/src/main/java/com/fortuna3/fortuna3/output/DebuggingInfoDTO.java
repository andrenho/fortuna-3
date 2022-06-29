package com.fortuna3.fortuna3.output;

import lombok.Data;

import java.util.Map;

@Data
public class DebuggingInfoDTO {

    private boolean success;
    private Map<String, SourceProjectDTO> projects;
    private Integer hash;
    private String errorMessage;
}
