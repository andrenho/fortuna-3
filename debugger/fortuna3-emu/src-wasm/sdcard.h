#ifndef SRC_WASM_SDCARD_H
#define SRC_WASM_SDCARD_H

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

bool sdcard_init(size_t sz, char last_error[0x200]);
void sdcard_copy_page(size_t page, uint8_t* data);
size_t sdcard_compressed_image_bound();
bool sdcard_copy_compressed_image(uint8_t* output, unsigned long* output_sz, char last_error[0x200]);

#endif //SRC_WASM_SDCARD_H
