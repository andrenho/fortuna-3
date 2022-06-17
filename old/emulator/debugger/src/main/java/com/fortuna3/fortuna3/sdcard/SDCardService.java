package com.fortuna3.fortuna3.sdcard;

import com.fortuna3.fortuna3.projectfile.ProjectFileDTO;
import com.fortuna3.fortuna3.projectfile.ProjectFileService;
import de.waldheinz.fs.BlockDevice;
import de.waldheinz.fs.fat.FatFileSystem;
import de.waldheinz.fs.fat.FatType;
import de.waldheinz.fs.fat.SuperFloppyFormatter;
import de.waldheinz.fs.util.FileDisk;
import de.waldheinz.fs.util.RamDisk;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;

@Service
public class SDCardService {

    @Autowired
    private ProjectFileService projectFileService;

    private BlockDevice dev;
    private FatFileSystem fs;

    @PostConstruct @DependsOn("ProjectFileService")
    public void initialize() throws IOException {
        readConfigFile();
    }

    public void readConfigFile() throws IOException {
        ProjectFileDTO.SDCardDTO sdCardDTO = projectFileService.getProjectFile().getDebugger().getSdCard();
        int size = sdCardDTO.getSizeMb() * 1024 * 1024;

        if (sdCardDTO.getBlockType() == ProjectFileDTO.SDCardDTO.BlockType.RAM) {
            dev = new RamDisk(size);
        } else {
            File file = new File(sdCardDTO.getFilename());
            if (file.exists())
                file.delete();
            file.createNewFile();
            try(FileOutputStream fo = new FileOutputStream(file)) {
                fo.write(new byte[size]);
            }
            dev = new FileDisk(file, false);
        }

        switch (sdCardDTO.getFatType()) {
            case FAT12 -> SuperFloppyFormatter.get(dev).setFatType(FatType.FAT12).format();
            case FAT16 -> SuperFloppyFormatter.get(dev).setFatType(FatType.FAT16).format();
            case FAT32 -> SuperFloppyFormatter.get(dev).setFatType(FatType.FAT32).format();
        }
    }

    public long getSdCardSizeInBlocks() throws IOException {
        return dev.getSize() / 512;
    }

    public byte[] getBlock(long block) throws IOException {
        ByteBuffer byteBuffer = ByteBuffer.allocate(512);
        dev.read(block * 512, byteBuffer);
        return byteBuffer.array();
    }
}
