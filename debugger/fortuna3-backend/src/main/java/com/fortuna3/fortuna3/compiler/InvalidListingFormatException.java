package com.fortuna3.fortuna3.compiler;

public class InvalidListingFormatException extends Exception {

    public InvalidListingFormatException(int line, String description) {
        super("Invalid listing.txt file (line " + line + "): " + description);
    }
}
