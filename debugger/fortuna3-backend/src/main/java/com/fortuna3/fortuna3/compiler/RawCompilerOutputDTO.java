package com.fortuna3.fortuna3.compiler;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class RawCompilerOutputDTO {
    private int status;
    private List<String> output = new ArrayList<>();
    private List<String> error = new ArrayList<>();
}
