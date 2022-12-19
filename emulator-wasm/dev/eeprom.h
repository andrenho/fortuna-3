#ifndef EEPROM_H_
#define EEPROM_H_

#include <stdint.h>

uint8_t eeprom_read(uint16_t addr);
void    eeprom_write(uint16_t addr, uint8_t data);
void    eeprom_copy_page(uint8_t page, uint8_t* data);

#endif

// vim:ts=4:sts=4:sw=4:expandtab