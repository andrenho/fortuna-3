#ifndef EMULATOR_RAM_H
#define EMULATOR_RAM_H

#include <stddef.h>
#include <stdint.h>

void ram_init(size_t sz);

void ram_banks(uint8_t* virtual_banks);
void ram_set_bank(uint8_t virtual_bank, uint8_t physical_bank);

uint8_t ram_get(uint16_t addr);
void    ram_get_page(uint16_t page, uint8_t* data);
void    ram_set(uint16_t addr, uint8_t data);

#endif //EMULATOR_RAM_H
