package com.fortuna3.output.controller;

import com.fortuna3.compiler.service.CompilerService;
import com.fortuna3.output.dto.DebuggingInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OutputRestController {

    private final CompilerService compilerService;

    @GetMapping("/compiler/crc")
    public ResponseEntity<Integer> getCrc() {
        return ResponseEntity.ok(compilerService.getHash());
    }

    @GetMapping("/compiler/output")
    public ResponseEntity<DebuggingInfo> getDebuggingInfo() {
        return ResponseEntity.ok(compilerService.getCurrentDebuggingInfo());
    }
}