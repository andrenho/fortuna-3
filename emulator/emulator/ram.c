#include "ram.h"

#include <stdlib.h>
#include <string.h>

static uint8_t ram_[512 * 1024];

void ram_init()
{
    srand(0);
    for (size_t i = 0; i < sizeof ram_; ++i)
        ram_[i] = rand() & 0xff;
}

void ram_copy(uint16_t pos, uint16_t sz, uint8_t* data)
{
    memcpy(data, &ram_[pos], sz);
}