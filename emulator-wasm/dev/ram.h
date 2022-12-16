#ifndef RAM_H_
#define RAM_H_

#include <stdint.h>

void    ram_init(void);

uint8_t ram_bank(void);
void    ram_set_bank(uint8_t bank);

uint8_t ram_get_byte(uint16_t addr);
void    ram_set_byte(uint16_t addr, uint8_t data);

uint16_t ram_get_string(uint16_t addr, uint8_t* buf, uint16_t max_sz);

void    ram_read_array(uint16_t initial_addr, uint8_t* bytes, uint16_t sz);
void    ram_write_array(uint16_t initial_addr, uint8_t* bytes, uint16_t sz);

#endif
