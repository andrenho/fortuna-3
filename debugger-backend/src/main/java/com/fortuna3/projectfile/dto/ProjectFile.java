package com.fortuna3.projectfile.dto;

import java.util.Map;

public record ProjectFile(
        String biosSource,
        Map<String, Project> projects,
        DebuggerSetup debuggerSetup
) {
    public record Project(
            String source,
            Integer address
    ) {}
}
