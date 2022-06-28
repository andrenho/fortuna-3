package com.fortuna3.fortuna3.output;

import lombok.Data;

import java.util.List;

@Data
public class SourceLineDTO {

    private Integer address;
    private String line;
    private List<Byte> bytes;
}
