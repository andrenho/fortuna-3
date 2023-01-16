package com.fortuna3.output.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;

import java.util.Map;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record DebuggingInfo(boolean success, Map<String, SourceProject> projects, String errorMessage, Integer sdCardSizeInMB) {
    public Integer hash() {
        return hashCode();
    }
}
