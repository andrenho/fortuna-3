#ifndef SDCARD_H_
#define SDCARD_H_

#include <stddef.h>
#include <stdint.h>

void sdcard_init(size_t sz);
void sdcard_copy_page(size_t page, uint8_t* data);

#endif
