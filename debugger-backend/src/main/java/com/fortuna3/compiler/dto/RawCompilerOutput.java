package com.fortuna3.compiler.dto;

import lombok.Builder;

@Builder
public record RawCompilerOutput(
    int status,
    String compilerOutput,
    String compilerError,
    String listing,
    byte[] rom,
    String mainSourceFile
) {
}
