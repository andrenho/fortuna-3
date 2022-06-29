package com.fortuna3.fortuna3.restcontroller;

import com.fortuna3.fortuna3.compiler.CompilerService;
import com.fortuna3.fortuna3.output.DebuggingInfoDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CompilerRestController {

    @Autowired
    private CompilerService compilerService;

    @GetMapping("/compiler/crc")
    public ResponseEntity<Integer> getCrc() {
        return ResponseEntity.ok(compilerService.getHash());
    }

    @GetMapping("/compiler/output")
    public ResponseEntity<DebuggingInfoDTO> getDebuggingInfo() {
        return ResponseEntity.ok(compilerService.getCurrentDebuggingInfo());
    }
}
