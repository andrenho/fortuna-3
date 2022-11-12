#include "random.h"

#include <stdio.h>

#include <avr/eeprom.h>
#include <avr/pgmspace.h>

static uint32_t next = 0;

uint32_t random_init(void)
{
    next = eeprom_read_dword((uint32_t *) 0);
    uint32_t seed = random();
    eeprom_write_dword((uint32_t *) 0, seed);
    return seed;
}

uint32_t random_value(void)
{
    uint32_t a = (next * 9301 + 49297) % 233280;
    uint32_t b = (a * 9301 + 49297) % 233280;
    next = (a << 16) | b;
    return next;
}

// vim:ts=4:sts=4:sw=4:expandtab
