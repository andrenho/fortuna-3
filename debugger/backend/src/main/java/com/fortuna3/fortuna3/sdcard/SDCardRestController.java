package com.fortuna3.fortuna3.sdcard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Random;

@RestController
public class SDCardRestController {

    @Autowired
    private SDCardService sdCardService;

    @GetMapping("/api/sdcard/0")
    private ResponseEntity<SDCardDTO> getInfo() throws IOException {
        return ResponseEntity.ok(new SDCardDTO(sdCardService.getSdCardSizeInBlocks()));
    }

    @GetMapping("/api/sdcard/0/{block}")
    private ResponseEntity<SDBlockDTO> getBlock(@PathVariable Integer block) throws IOException {
        if (block >= sdCardService.getSdCardSizeInBlocks() || block < 0)
            return ResponseEntity.notFound().build();

        SDBlockDTO sdBlockDTO = new SDBlockDTO();
        sdBlockDTO.setBlockNumber(block);
        sdBlockDTO.setBytes(sdCardService.getBlock(block));
        return ResponseEntity.ok(sdBlockDTO);
    }

    /*
    @PostMapping("/0/block/{block}")
    private ResponseEntity<Void> updateBlock(@PathVariable Integer block, @RequestBody SDBlockDTO blockDTO) {
    }
     */

}
