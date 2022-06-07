package com.fortuna3.fortuna3.sdcard;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Random;

@RestController
public class SDCardRestController {

    @GetMapping("/api/sdcard/0")
    private ResponseEntity<SDCardDTO> getInfo() {
        return ResponseEntity.ok(new SDCardDTO(256));
    }

    @GetMapping("/api/sdcard/0/{block}")
    private ResponseEntity<SDBlockDTO> getBlock(@PathVariable Integer block) {
        if (block >= 256 || block < 0)
            return ResponseEntity.notFound().build();

        SDBlockDTO sdBlockDTO = new SDBlockDTO();
        sdBlockDTO.setBlockNumber(block);
        sdBlockDTO.setBytes(new byte[512]);
        new Random().nextBytes(sdBlockDTO.getBytes());
        return ResponseEntity.ok(sdBlockDTO);
    }

    /*
    @PostMapping("/0/block/{block}")
    private ResponseEntity<Void> updateBlock(@PathVariable Integer block, @RequestBody SDBlockDTO blockDTO) {
    }
     */

}
