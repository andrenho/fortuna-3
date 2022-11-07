#include "eeprom.h"

static uint8_t eeprom[4096];

uint8_t eeprom_read(uint16_t addr)
{
    return eeprom[addr % 4096];
}

void eeprom_write(uint16_t addr, uint8_t data)
{
    eeprom[addr % 4096] = data;
}