package com.fortuna3.fortuna3.compiler;

import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

import java.io.*;
import java.nio.file.Files;
import java.util.Objects;

@Service
public class CompilerExecutableService {

    private String tmpdir;
    private String compilerPath;

    @PostConstruct
    public void uncompressCompiler() throws IOException {

        tmpdir = Files.createTempDirectory("fortuna").toFile().getAbsolutePath();

        String compilerName;
        if (System.getProperty("os.name").indexOf("win") >= 0)
            compilerName = "/vasmz80_oldstyle-win32.exe";
        else if (System.getProperty("os.name").equals("Linux"))
            compilerName = "/vasmz80_oldstyle-linux";
        else
            throw new RuntimeException("Sorry, operating system unsupported.");

        compilerPath = tmpdir + compilerName;

        System.out.println("Compiler extracted to " + compilerPath);
        try (var is = Objects.requireNonNull(getClass().getResource("/compiler" + compilerName)).openStream();
             var os = new FileOutputStream(compilerPath)) {
            var b = new byte[2048];
            int length;

            while ((length = is.read(b)) != -1)
                os.write(b, 0, length);
        }

        new File(compilerPath).setExecutable(true);
    }

    @PreDestroy
    public void deleteCompiler() {

        new File(compilerPath).delete();
        new File(tmpdir).delete();
    }

    public String getCompilerPath() {
        return compilerPath;
    }
}
