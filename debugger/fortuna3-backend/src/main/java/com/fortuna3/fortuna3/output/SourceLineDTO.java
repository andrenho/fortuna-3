package com.fortuna3.fortuna3.output;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@Data
@EqualsAndHashCode
public class SourceLineDTO {

    private Integer address;
    private String line;

    @JsonIgnore
    private byte[] byteArray;

    public List<Integer> getBytes() {
        if (byteArray == null)
            return null;

        List<Integer> bytes = new ArrayList<>(byteArray.length);
        for (byte b : byteArray) bytes.add(Byte.toUnsignedInt(b));
        return bytes;
    }
}
