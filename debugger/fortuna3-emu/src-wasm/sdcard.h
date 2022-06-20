#ifndef SRC_WASM_SDCARD_H
#define SRC_WASM_SDCARD_H

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

typedef enum { FAT16, FAT32 } FatType;

bool sdcard_init(size_t sz, FatType fat_type, char last_error[0x200]);
void sdcard_copy_page(size_t page, uint8_t* data);

#endif //SRC_WASM_SDCARD_H
