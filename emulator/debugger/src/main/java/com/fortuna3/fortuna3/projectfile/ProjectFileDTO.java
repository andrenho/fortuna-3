package com.fortuna3.fortuna3.projectfile;

import lombok.Data;

@Data
public class ProjectFileDTO {

    @Data
    public static class SDCardDTO {
        public enum FatType { FAT12, FAT16, FAT32 };
        public enum BlockType { RAM, FILE };

        private int sizeMb;
        private FatType fatType;
        private BlockType blockType;
        private String filename;
    }

    @Data
    public static class DebuggerDTO {
        private SDCardDTO sdCard;
    }

    private DebuggerDTO debugger;

}
