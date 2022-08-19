#ifndef IO_H_
#define IO_H_

#include <stdint.h>

void    io_write(uint8_t addr, uint8_t data);
uint8_t io_read(uint8_t addr);

#endif
