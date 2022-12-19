#ifndef STATE_H_
#define STATE_H_

#include <stddef.h>
#include <stdint.h>

void   get_state(uint16_t ram_page, size_t sd_page, uint16_t eeprom_page, uint8_t* data);
size_t max_printed_chars();

#endif