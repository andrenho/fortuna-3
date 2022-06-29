package com.fortuna3.fortuna3.compiler;

import lombok.Data;

@Data
public class RawCompilerOutputDTO {
    private int status;
    private String compilerOutput;
    private String compilerError;
    private String listing;
    private byte[] rom;
}
