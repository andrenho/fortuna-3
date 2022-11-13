#include <avr/eeprom.h>

uint8_t eeprom_read(uint16_t addr)
{
    return eeprom_read_byte((uint8_t *) addr);
}

void eeprom_write(uint16_t addr, uint8_t data)
{
    eeprom_write_byte((uint8_t *) addr, data);
}

// vim:ts=4:sts=4:sw=4:expandtab