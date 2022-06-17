#ifndef EMULATOR_EMULATOR_H
#define EMULATOR_EMULATOR_H

#include <stdint.h>

#include "z80/Z80.h"

#define RAM_PAGE_SZ 256

extern Z80 z80;

void emulator_init();
Z80 const* emulator_z80();
uint8_t const* emulator_ram_page(uint8_t page);

#endif //EMULATOR_EMULATOR_H
