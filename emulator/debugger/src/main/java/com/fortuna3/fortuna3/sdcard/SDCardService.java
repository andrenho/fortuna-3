package com.fortuna3.fortuna3.sdcard;

import de.waldheinz.fs.BlockDevice;
import de.waldheinz.fs.fat.FatFileSystem;
import de.waldheinz.fs.fat.FatType;
import de.waldheinz.fs.fat.SuperFloppyFormatter;
import de.waldheinz.fs.util.RamDisk;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.ByteBuffer;

@Service
public class SDCardService {

    private BlockDevice dev;
    private FatFileSystem fs;

    public void initialize(int sdCardSize) throws IOException {
        dev = new RamDisk(sdCardSize);
        fs = SuperFloppyFormatter.get(dev).setFatType(FatType.FAT16).format();
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
