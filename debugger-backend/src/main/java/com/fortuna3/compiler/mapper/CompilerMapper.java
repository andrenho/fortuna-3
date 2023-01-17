package com.fortuna3.compiler.mapper;

import com.fortuna3.compiler.dto.RawCompilerOutput;
import com.fortuna3.compiler.exception.InvalidListingFormatException;
import com.fortuna3.output.dto.SourceLine;
import com.fortuna3.output.dto.SourceLineAdditionalContext;
import com.fortuna3.output.dto.SourceProject;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class CompilerMapper {

    private static class CompilationContext {
        private Integer lastCommandIndex = null;
    }

    private enum Section { NONE, SOURCE, SYMBOLS, LABELS }

    private final Pattern filenamePattern = Pattern.compile("\\\"(.*?)\\\"");

    public SourceProject mapRawToSourceProject(RawCompilerOutput rawCompilerOutput, Integer address, boolean collapseMacrosParameter) {

        var sourceProject = new SourceProject();
        sourceProject.setSuccess(rawCompilerOutput.status() == 0);
        sourceProject.setMainSourceFile(rawCompilerOutput.mainSourceFile());
        sourceProject.setAddress(address);
        if (rawCompilerOutput.status() == 0) {
            sourceProject.setBinary(rawCompilerOutput.rom());
            try {
                mapListingFiletoSourceProject(rawCompilerOutput, sourceProject, collapseMacrosParameter);
            } catch (InvalidListingFormatException e) {
                sourceProject.setSuccess(false);
                sourceProject.setCompilerError(e.getMessage());
            }
        } else {
            sourceProject.setCompilerError(rawCompilerOutput.compilerError());
        }

        return sourceProject;
    }

    private void mapListingFiletoSourceProject(RawCompilerOutput rawCompilerOutput, SourceProject sourceProject, boolean collapseMacrosParameter) throws InvalidListingFormatException {

        var currentSection = Section.NONE;
        String currentFile = null;
        int nline = 1;
        var context = new CompilationContext();

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
                    case SOURCE -> {
                        var source = sourceProject.getSource().get(currentFile);
                        source.add(parseLine(line, source.size(), context));
                    }
                    case LABELS -> addLabel(line, sourceProject.getLabels());
                    case SYMBOLS -> addSymbol(line, sourceProject.getSymbols());
                }
            }

            ++nline;
        }

        if (collapseMacrosParameter) {
            for (var source : sourceProject.getSource().values())
                collapseMacros(source);
        }
    }

    private SourceLine parseLine(String line, int index, CompilationContext context) {

        List<Integer> addresses = new ArrayList<>();
        try {
            addresses.add(HexFormat.fromHexDigits(line.substring(3, 7)));
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

        boolean isMacro = false;
        if (line.length() > 31 && line.charAt(31) == 'M') {
            isMacro = true;
        } else {
            context.lastCommandIndex = index;
        }

        return SourceLine.builder()
                .addresses(addresses)
                .line(newLine)
                .byteArray(byteArray)
                .isMacro(isMacro)
                .additionalContext(Boolean.TRUE.equals(isMacro) ? SourceLineAdditionalContext.fromMacroParentIndex(context.lastCommandIndex) : null)
                .build();
    }

    private void addLabel(String line, Map<String, Integer> labels) {
        labels.put(line.substring(5), HexFormat.fromHexDigits(line.substring(0, 4).trim()));
    }

    private void addSymbol(String line, Map<String, Integer> symbols) {
        symbols.put(line.substring(0, 32).trim(), HexFormat.fromHexDigits(line.substring(35, 39).trim()));
    }

    private void collapseMacros(List<SourceLine> source) {
        for (var line : source) {
            if (line.isMacro()) {
                var parentMacroLine = source.get(line.additionalContext().macroParentIndex());
                parentMacroLine.addresses().add(line.addresses().get(0));
            }
        }
        source.removeIf(SourceLine::isMacro);
    }

}
