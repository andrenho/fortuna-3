package com.fortuna3.fortuna3.compiler;

import lombok.Builder;

@Builder
public record RawCompilerOutputDTO(
    int status,
    String compilerOutput,
    String compilerError,
    String listing,
    byte[] rom,
    String mainSourceFile
) {
}
