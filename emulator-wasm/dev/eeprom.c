#include "eeprom.h"

#include <string.h>

static uint8_t eeprom[4096] = {0};

uint8_t eeprom_read(uint16_t addr)
{
    return eeprom[addr % 4096];
}

void eeprom_write(uint16_t addr, uint8_t data)
{
    eeprom[addr % 4096] = data;
}

void eeprom_copy_page(uint8_t page, uint8_t* data)
{
    memcpy(data, &eeprom[(page % 16) * 256], 256);
}