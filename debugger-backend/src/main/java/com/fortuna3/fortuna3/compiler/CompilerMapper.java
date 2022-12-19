package com.fortuna3.fortuna3.compiler;

import com.fortuna3.fortuna3.output.SourceLineDTO;
import com.fortuna3.fortuna3.output.SourceProjectDTO;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HexFormat;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class CompilerMapper {

    private enum Section { NONE, SOURCE, SYMBOLS, LABELS }

    private final Pattern filenamePattern = Pattern.compile("\\\"(.*?)\\\"");

    public SourceProjectDTO mapRawToSourceProject(RawCompilerOutputDTO rawCompilerOutput, Integer address) {

        var sourceProject = new SourceProjectDTO();
        sourceProject.setSuccess(rawCompilerOutput.status() == 0);
        sourceProject.setMainSourceFile(rawCompilerOutput.mainSourceFile());
        sourceProject.setAddress(address);
        if (rawCompilerOutput.status() == 0) {
            sourceProject.setBinary(rawCompilerOutput.rom());
            try {
                mapListingFiletoSourceProject(rawCompilerOutput, sourceProject);
            } catch (InvalidListingFormatException e) {
                sourceProject.setSuccess(false);
                sourceProject.setCompilerError(e.getMessage());
            }
        } else {
            sourceProject.setCompilerError(rawCompilerOutput.compilerError());
        }

        return sourceProject;
    }

    private void mapListingFiletoSourceProject(RawCompilerOutputDTO rawCompilerOutput, SourceProjectDTO sourceProject) throws InvalidListingFormatException {

        var currentSection = Section.NONE;
        String currentFile = null;
        int nline = 1;

        for (var line: rawCompilerOutput.listing().split("\n")) {

            line = line.replace("\r", "");

            if (line.startsWith("Source: ")) {
                currentSection = Section.SOURCE;
                Matcher matcher = filenamePattern.matcher(line);
                if (matcher.find()) {
                    currentFile = matcher.group(1);
                    sourceProject.getSource().putIfAbsent(currentFile, new ArrayList<>());
                } else {
                    throw new InvalidListingFormatException(nline, "invalid source file name");
                }
            } else if (line.startsWith("Symbols by name:")) {
                currentSection = Section.SYMBOLS;
            } else if (line.startsWith("Labels by address:")) {
                currentSection = Section.LABELS;
            } else if (!line.isBlank()) {
                switch (currentSection) {
                    case SOURCE -> sourceProject.getSource().get(currentFile).add(parseLine(line));
                    case LABELS -> addLabel(line, sourceProject.getLabels());
                    case SYMBOLS -> addSymbol(line, sourceProject.getSymbols());
                }
            }

            ++nline;
        }
    }

    private SourceLineDTO parseLine(String line) {

        Integer address = null;
        try {
            address = HexFormat.fromHexDigits(line.substring(3, 7));
        } catch (IllegalArgumentException ignored) {}

        String newLine = "";
        try {
            newLine = line.substring(33);
        } catch (IndexOutOfBoundsException ignored) {}

        var byteArray = new byte[0];
        try {
            byteArray = HexFormat.of().parseHex(line.substring(8, 24).trim());
        } catch (StringIndexOutOfBoundsException ignored) {
            byteArray = HexFormat.of().parseHex(line.substring(8).trim());
        } catch (IllegalArgumentException ignored) {}
        if (byteArray.length == 0)
            byteArray = null;

        return SourceLineDTO.builder()
                .address(address)
                .line(newLine)
                .byteArray(byteArray)
                .build();
    }

    private void addLabel(String line, Map<String, Integer> labels) {
        labels.put(line.substring(5), HexFormat.fromHexDigits(line.substring(0, 4).trim()));
    }

    private void addSymbol(String line, Map<String, Integer> symbols) {
        symbols.put(line.substring(0, 32).trim(), HexFormat.fromHexDigits(line.substring(35, 39).trim()));
    }
}

