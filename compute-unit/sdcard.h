#ifndef SDCARD_H_
#define SDCARD_H_

#include <stdbool.h>
#include <stdint.h>

void sdcard_init(void);

bool sdcard_setup(void);
bool sdcard_read_block(uint32_t block, uint8_t* buffer);

#endif

// vim:ts=4:sts=4:sw=4:expandtab
