#include <emscripten/emscripten.h>

#include "ram.h"

#include <stdlib.h>
#include <string.h>
#include <stdio.h>

#define RAM_SZ (512 * 1024)
#define BANK_SZ (64 * 1024)

static uint8_t* ram_ = 0;
static uint8_t bank_ = 0;

void ram_init(void)
{
    free(ram_);
    ram_ = malloc(RAM_SZ);

    for (size_t i = 0; i < (RAM_SZ / 4); ++i)
        ((uint32_t *) ram_)[i] = 0xffffffff;
}

uint8_t ram_bank(void)
{
    return bank_;
}

void ram_set_bank(uint8_t bank)
{
    bank_ = bank & 0x7;
    printf("Bank is now %d\n", bank_);
}

uint8_t ram_get_byte(uint16_t addr)
{
    return ram_[(bank_ * BANK_SZ) + addr];
}

EMSCRIPTEN_KEEPALIVE void ram_set_byte(uint16_t addr, uint8_t data)
{
    ram_[(bank_ * BANK_SZ) + addr] = data;
}

uint16_t ram_get_string(uint16_t addr, uint8_t* buf, uint16_t max_sz)
{
    for (size_t i = 0; i < max_sz; ++i) {
        uint8_t data = ram_get_byte(addr + i);
        buf[i] = data;
        if (data == 0)
            return i;
    }

    return max_sz;
}

void ram_read_array(uint16_t initial_addr, uint8_t* bytes, uint16_t sz)
{
    memcpy(bytes, (const void *) &ram_[(bank_ * BANK_SZ) + initial_addr], sz);
}

void ram_write_array(uint16_t initial_addr, uint8_t* bytes, uint16_t sz)
{
    memcpy(&ram_[(bank_ * BANK_SZ) + initial_addr], (const void *) bytes, sz);
}