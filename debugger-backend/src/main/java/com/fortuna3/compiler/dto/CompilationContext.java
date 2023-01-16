package com.fortuna3.compiler.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CompilationContext {
    private String lastLineNotInMacro;
}
