#include "ram.h"

#include <stdint.h>
#include <stdlib.h>
#include <string.h>

static uint8_t* ram_;
static uint8_t virtual_banks[4] = { 0, 1, 2, 3 };

void ram_init(size_t sz)
{
    ram_ = malloc(sz);

    srand(0);
    for (size_t i = 0; i < (sz / 4); ++i)
        ((uint32_t *) ram_)[i] = rand();
}

void ram_banks(uint8_t* virtual_banks_)
{
    memcpy(virtual_banks_, virtual_banks, 4);
}

void ram_set_bank(uint8_t virtual_bank, uint8_t physical_bank)
{
    if (virtual_bank < 4)
        virtual_banks[virtual_bank] = physical_bank;
}

static uint32_t translate_virtual_to_physical(uint16_t virtual_addr)
{
    static const uint16_t _16kb = 16 * 1024;
    uint8_t virtual_bank = virtual_addr / _16kb;
    uint32_t physical_bank = virtual_banks[virtual_bank];
    return (physical_bank * _16kb) + (virtual_addr % _16kb);
}

uint8_t ram_get(uint16_t addr)
{
    return ram_[translate_virtual_to_physical(addr)];
}

void ram_get_page(uint16_t page, uint8_t* data)
{
    uint32_t starting_physical_addr = translate_virtual_to_physical(page * 256);
    memcpy(data, &ram_[starting_physical_addr], 256);
}

void ram_set(uint16_t addr, uint8_t data)
{
    ram_[translate_virtual_to_physical(addr)] = data;
}
