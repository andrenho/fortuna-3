#include <emscripten/emscripten.h>

#include <stdint.h>
#include <string.h>
#include <stdlib.h>

// #include "emulator.h"
#include "ram.h"
// #include "sdcard.h"

#define KB *1024
#define MB KB*1024

EMSCRIPTEN_KEEPALIVE void initialize(/* size_t sdcard_sz_in_mb */)
{
    // emulator_init();
    ram_init(512 KB);
    // sdcard_init(sdcard_sz_in_mb MB);
};

/* State format:
 *
 *  [  0x0 - 0x???] : Z80
 *  [ 0xe8 - 0xff ] : Stack
 *  [0x100 - 0x1ff] : RAM
 *  [0x200 - 0x3ff] : SDCard
 */
#include <stdio.h>
EMSCRIPTEN_KEEPALIVE void get_state(uint16_t ram_page, /* size_t sd_page, */ uint8_t* data) {
    /*
    data[0x0] = z80.AF.B.l;
    data[0x1] = z80.AF.B.h;
    data[0x2] = z80.BC.B.l;
    data[0x3] = z80.BC.B.h;
    data[0x4] = z80.DE.B.l;
    data[0x5] = z80.DE.B.h;
    data[0x6] = z80.HL.B.l;
    data[0x7] = z80.HL.B.h;
    data[0x8] = z80.IX.B.l;
    data[0x9] = z80.IX.B.h;
    data[0xa] = z80.IY.B.l;
    data[0xb] = z80.IY.B.h;
    data[0xc] = z80.PC.B.l;
    data[0xd] = z80.PC.B.h;
    data[0xe] = z80.SP.B.l;
    data[0xf] = z80.SP.B.h;
    data[0x10] = z80.AF.B.l;
    data[0x11] = z80.AF.B.h;
    data[0x12] = z80.BC.B.l;
    data[0x13] = z80.BC.B.h;
    data[0x14] = z80.DE.B.l;
    data[0x15] = z80.DE.B.h;
    data[0x16] = z80.HL.B.l;
    data[0x17] = z80.HL.B.h;
    data[0x18] = z80.I;

    // stack
    for (uint16_t addr = 0; addr < 24; ++addr)
        data[addr + 0xe8] = ram_get(z80.SP.W + addr);
    */

    // RAM
    ram_get_page(ram_page, &data[0x100]);

    /*
    // SD Card
    sdcard_copy_page(sd_page, &data[0x200]);
    */
}

// vim: ts=4:sts=4:sw=4:noexpandtab
