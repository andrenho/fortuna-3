#ifndef RAM_H_
#define RAM_H_

#include <stdint.h>

void ram_init(void);

uint8_t ram_bank(void);
void    ram_set_bank(uint8_t bank);

uint8_t ram_get_byte(uint16_t addr);
void    ram_set_byte(uint16_t addr, uint8_t data);

void    ram_get_block(uint16_t block, uint8_t* bytes);

#endif
