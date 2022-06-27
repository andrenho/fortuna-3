package com.fortuna3.fortuna3.sdcard;

import lombok.Data;

@Data
public class SDBlockDTO {
    private int blockNumber;
    private byte[] bytes;
}
