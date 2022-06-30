package com.fortuna3.fortuna3.output;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Map;

@Data
@EqualsAndHashCode
public class DebuggingInfoDTO {

    private boolean success;
    private Map<String, SourceProjectDTO> projects;
    private String errorMessage;

    public Integer getHash() {
        return hashCode();
    }
}
