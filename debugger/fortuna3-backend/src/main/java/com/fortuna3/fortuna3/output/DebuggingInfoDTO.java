package com.fortuna3.fortuna3.output;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.util.Map;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record DebuggingInfoDTO(boolean success, Map<String, SourceProjectDTO> projects, String errorMessage, Integer sdCardSizeInMB) {
    public Integer hash() {
        return hashCode();
    }
}
