package com.fortuna3.fortuna3.compiler;

import com.fortuna3.fortuna3.output.SourceProjectDTO;
import org.springframework.stereotype.Component;

import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.CRC32;

@Component
public class CompilerMapper {

    private enum Section { NONE, SOURCE, SYMBOLS, LABELS }

    private Pattern filenamePattern = Pattern.compile("\\\"(.*?)\\\"");

    public SourceProjectDTO mapRawToSourceProject(RawCompilerOutputDTO rawCompilerOutput) {

        SourceProjectDTO sourceProject = new SourceProjectDTO();
        sourceProject.setSuccess(rawCompilerOutput.getStatus() == 0);
        if (rawCompilerOutput.getStatus() != 0)
            sourceProject.setCompilerError(rawCompilerOutput.getCompilerError());
        sourceProject.setBinary(rawCompilerOutput.getRom());

        CRC32 crc32 = new CRC32();
        crc32.update(rawCompilerOutput.getRom());
        sourceProject.setCrc(crc32.getValue());

        try {
            mapListingFiletoSourceProject(rawCompilerOutput, sourceProject);
        } catch (InvalidListingFormatException e) {
            sourceProject.setSuccess(false);
            sourceProject.setCompilerError(e.getMessage());
        }

        return sourceProject;
    }

    private void mapListingFiletoSourceProject(RawCompilerOutputDTO rawCompilerOutput, SourceProjectDTO sourceProject) throws InvalidListingFormatException {

        Section currentSection = Section.NONE;
        String currentFile = null;
        int nline = 1;

        for (String line: rawCompilerOutput.getListing().split("\n")) {

            if (line.startsWith("Source: ")) {
                currentSection = Section.SOURCE;
                Matcher matcher = filenamePattern.matcher(line);
                if (matcher.find())
                    currentFile = matcher.group(1);
                else
                    throw new InvalidListingFormatException(nline, "invalid source file name");
            } else if (line.startsWith("Symbols by name:")) {
                currentSection = Section.SYMBOLS;
            } else if (line.startsWith("Labels by address:")) {
                currentSection = Section.LABELS;
            }

            ++nline;
        }
    }
}
