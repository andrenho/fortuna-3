package com.fortuna3.output.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SourceProject {

    private boolean success;
    private String mainSourceFile;
    private Map<String, List<SourceLine>> source = new HashMap<>();
    private Map<String, Integer> symbols = new HashMap<>();
    private Map<String, Integer> labels = new HashMap<>();
    private byte[] binary;
    private String compilerError;
    private Integer address;
}
