package com.fortuna3.fortuna3.output;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class SourceProjectDTO {

    private boolean success;
    private Map<String, List<SourceLineDTO>> source;
    private Map<String, Integer> symbols;
    private Map<String, Integer> labels;
    private byte[] binary;
    private Long crc;
    private String compilerError;
}
