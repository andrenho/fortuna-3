package com.fortuna3.projectfile.dto;

import java.util.List;

public record DebuggerSetup(
        Integer sdCardSizeInMB,
        List<Integer> breakpoints,
        Boolean runOnLoad
) {
}
