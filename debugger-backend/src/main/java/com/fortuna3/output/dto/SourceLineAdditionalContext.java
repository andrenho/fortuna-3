package com.fortuna3.output.dto;

import lombok.Builder;

@Builder
public record SourceLineAdditionalContext(Integer macroParentIndex) {

    public static SourceLineAdditionalContext fromMacroParentIndex(int index) {
        return SourceLineAdditionalContext.builder().macroParentIndex(index).build();
    }
}
