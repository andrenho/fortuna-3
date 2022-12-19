package com.fortuna3.fortuna3.restcontroller;

import com.fortuna3.fortuna3.compiler.CompilerService;
import com.fortuna3.fortuna3.output.DebuggingInfoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CompilerRestController {

    private final CompilerService compilerService;

    @GetMapping("/compiler/crc")
    public ResponseEntity<Integer> getCrc() {
        return ResponseEntity.ok(compilerService.getHash());
    }

    @GetMapping("/compiler/output")
    public ResponseEntity<DebuggingInfoDTO> getDebuggingInfo() {
        return ResponseEntity.ok(compilerService.getCurrentDebuggingInfo());
    }
}