package com.fortuna3.util;

import lombok.experimental.UtilityClass;
import lombok.extern.java.Log;

import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Objects;

@UtilityClass
@Log
public class Resources {

    public void copyResourceFile(String resourceFile, String destinationPath) throws IOException {

        try (var is = Objects.requireNonNull(Resources.class.getResource(resourceFile)).openStream();
                var os = new FileOutputStream(destinationPath)) {
            var b = new byte[2048];
            int length;

            while ((length = is.read(b)) != -1)
                os.write(b, 0, length);
        }

        log.info("Resource file " + resourceFile + " copied into " + destinationPath);
    }

}
