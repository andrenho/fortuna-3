#ifndef SRC_WASM_SDCARD_H
#define SRC_WASM_SDCARD_H

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

bool sdcard_init(size_t sz);
void sdcard_copy_page(size_t page, uint8_t* data);
void sdcard_set_ejected(bool ejected);

#endif //SRC_WASM_SDCARD_H
