package com.fortuna3.fortuna3.compiler;

import com.fortuna3.fortuna3.util.Resources;
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
    private String includeFile;

    @PostConstruct
    public void uncompressCompiler() throws IOException {

        tmpdir = Files.createTempDirectory("fortuna").toFile().getAbsolutePath();

        String compilerName;
        if (System.getProperty("os.name").contains("Win"))
            compilerName = "/vasmz80_oldstyle-win32.exe";
        else if (System.getProperty("os.name").equals("Linux"))
            compilerName = "/vasmz80_oldstyle-linux";
        else
            throw new RuntimeException("Sorry, operating system unsupported.");

        compilerPath = tmpdir + compilerName;

        Resources.copyResourceFile("/compiler" + compilerName, compilerPath);
        new File(compilerPath).setExecutable(true);

        includeFile = tmpdir + "/fortuna3.z80";
        Resources.copyResourceFile("/fortuna3.z80", includeFile);
    }

    @PreDestroy
    public void deleteCompiler() {

        new File(compilerPath).delete();
        new File(includeFile).delete();
        new File(tmpdir).delete();
    }

    public String getCompilerPath() {
        return compilerPath;
    }

    public String getIncludeFilePath() {
        return tmpdir;
    }
}
