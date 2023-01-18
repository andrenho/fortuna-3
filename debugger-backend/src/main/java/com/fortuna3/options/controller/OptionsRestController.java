package com.fortuna3.options.controller;

import com.fortuna3.options.dto.Options;
import com.fortuna3.options.service.OptionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class OptionsRestController {

    private final OptionsService optionsService;

    @GetMapping("/options")
    public ResponseEntity<Options> getOptions() {
        return ResponseEntity.ok(optionsService.getOptions());
    }

    @PutMapping("/options")
    public ResponseEntity<Options> putOptions(@RequestBody Options options) {
        return ResponseEntity.ok(optionsService.updateOptions(options));
    }
}
