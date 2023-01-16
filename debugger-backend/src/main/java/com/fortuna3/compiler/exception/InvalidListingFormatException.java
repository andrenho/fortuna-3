package com.fortuna3.compiler.exception;

public class InvalidListingFormatException extends Exception {

    public InvalidListingFormatException(int line, String description) {
        super("Invalid listing.txt file (line " + line + "): " + description);
    }
}
