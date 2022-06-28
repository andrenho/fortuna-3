package com.fortuna3.fortuna3.output;

import java.util.List;
import java.util.Map;

public class SourceProjectDTO {

    private Map<String, List<SourceLineDTO>> source;
    private List<Byte> binary;
    private Integer crc;
    private Double compilationTimeInSecs;
}
