package com.fortuna3.compiler.controller;

import com.fortuna3.compiler.service.CompilerService;
import com.fortuna3.output.dto.DebuggingInfo;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RestController
@RequiredArgsConstructor
public class CompilerRestController {

    private final CompilerService compilerService;

    private Boolean lastRequestCollapseMacros = null;
    private Random randomCrc = new Random();

    @GetMapping("/compiler/crc")
    public ResponseEntity<Integer> getCrc(@RequestParam(value="collapse_macros", defaultValue="false") Boolean collapseMacros) {
        if (!collapseMacros.equals(lastRequestCollapseMacros))
            return ResponseEntity.ok(randomCrc.nextInt());
        return ResponseEntity.ok(compilerService.getHash());
    }

    @GetMapping("/compiler/output")
    public ResponseEntity<DebuggingInfo> getDebuggingInfo(@RequestParam(value="collapse_macros", defaultValue="false") Boolean collapseMacros) {
        if (!collapseMacros.equals(lastRequestCollapseMacros)) {
            lastRequestCollapseMacros = collapseMacros;
            compilerService.setCollapseMacros(collapseMacros);
        }
        return ResponseEntity.ok(compilerService.getCurrentDebuggingInfo());
    }

}