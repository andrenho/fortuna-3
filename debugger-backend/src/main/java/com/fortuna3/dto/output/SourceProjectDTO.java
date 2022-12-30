package com.fortuna3.dto.output;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SourceProjectDTO {

    private boolean success;
    private String mainSourceFile;
    private Map<String, List<SourceLineDTO>> source = new HashMap<>();
    private Map<String, Integer> symbols = new HashMap<>();
    private Map<String, Integer> labels = new HashMap<>();
    private byte[] binary;
    private String compilerError;
    private Integer address;
}
