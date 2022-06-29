package com.fortuna3.fortuna3.output;

import lombok.Data;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class SourceProjectDTO {

    private boolean success;
    private Map<String, List<SourceLineDTO>> source = new HashMap<>();
    private Map<String, Integer> symbols = new HashMap<>();
    private Map<String, Integer> labels = new HashMap<>();
    private byte[] binary;
    private String compilerError;

    public int getCrc() {
        return Arrays.hashCode(binary);
    }
}
