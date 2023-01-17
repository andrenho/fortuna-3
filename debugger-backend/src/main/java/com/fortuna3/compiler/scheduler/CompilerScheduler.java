package com.fortuna3.compiler.scheduler;

import com.fortuna3.compiler.service.CompilerService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CompilerScheduler {

    private final CompilerService compilerService;

    @Scheduled(fixedRate = 1000)
    public void runVerification() {
        compilerService.recompileAllFiles();
    }
}
