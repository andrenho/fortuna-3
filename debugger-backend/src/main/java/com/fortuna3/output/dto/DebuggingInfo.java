package com.fortuna3.output.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fortuna3.projectfile.dto.DebuggerSetup;
import lombok.Builder;

import java.util.Map;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record DebuggingInfo(
        boolean success,
        Map<String, SourceProject> projects,
        String errorMessage,
        DebuggerSetup debuggerSetup
) {
    public Integer hash() {
        return hashCode();
    }
}
