package com.fortuna3.output.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Builder
public record SourceLine(Integer address, String line, @JsonIgnore byte[] byteArray, Boolean isMacro, String macroContext) {

    @JsonProperty("bytes")
    public List<Integer> bytes() {
        if (byteArray == null)
            return null;

        List<Integer> bytes = new ArrayList<>(byteArray.length);
        for (byte b : byteArray) bytes.add(Byte.toUnsignedInt(b));
        return bytes;
    }

    @Override
    public int hashCode() {
        return line.hashCode();
    }
}
