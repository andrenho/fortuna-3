#ifndef EMULATOR_RAM_H
#define EMULATOR_RAM_H

#include <stddef.h>
#include <stdint.h>

void ram_init(size_t sz);

void ram_copy(uint16_t pos, uint16_t sz, uint8_t* data);

#endif //EMULATOR_RAM_H
