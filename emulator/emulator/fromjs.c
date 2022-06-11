#include <emscripten/emscripten.h>

#include <stdint.h>
#include <string.h>

#include "emulator.h"
#include "ram.h"

EMSCRIPTEN_KEEPALIVE void initialize()
{
    emulator_init();
    ram_init();
};

/* State format:
 *
 *  [  0x0 - 0x???] : Z80
 *  [ 0xe8 - 0xff ] : Stack
 *  [0x100 - 0x1ff] : RAM
 *  [0x200 - 0x3ff] : SDCard
 */
EMSCRIPTEN_KEEPALIVE void get_state(uint16_t page, uint8_t* data) {
    ram_copy(z80.SP.W, 24, &data[0xe8]);
    ram_copy(page * 256, 256, &data[0x100]);
}

// vim: ts=4:sts=4:sw=4:noexpandtab
