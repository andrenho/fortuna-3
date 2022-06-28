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

        // TODO - what about linux?
        compilerPath = tmpdir + "/vasmz80_oldstyle.exe";
        System.out.println(compilerPath);
        try (InputStream is = Objects.requireNonNull(getClass().getResource("/compiler/vasmz80_oldstyle.exe")).openStream();
             OutputStream os = new FileOutputStream(compilerPath)) {
            byte[] b = new byte[2048];
            int length;

            while ((length = is.read(b)) != -1)
                os.write(b, 0, length);
        }
    }

    @PreDestroy
    public void deleteCompiler() {

        File file = new File(compilerPath);
        file.delete();

        file = new File(tmpdir);
        file.delete();
    }

    public String getCompilerPath() {
        return compilerPath;
    }
}
