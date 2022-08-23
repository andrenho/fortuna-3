#ifndef IO_H_
#define IO_H_

#include <stdbool.h>
#include <stdint.h>

bool io_write(uint8_t addr, uint8_t data); // return true if the I/O requires the bus
void io_write_bus(uint8_t addr, uint8_t data);

uint8_t io_read(uint8_t addr);

#endif
