package com.fortuna3.fortuna3.output;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Map;

@Data
@EqualsAndHashCode
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DebuggingInfoDTO {

    private boolean success;
    private Map<String, SourceProjectDTO> projects;
    private String errorMessage;
    private Integer sdCardSizeInMB;

    public Integer getHash() {
        return hashCode();
    }
}
