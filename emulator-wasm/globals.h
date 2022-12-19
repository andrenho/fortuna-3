#ifndef GLOBALS_H_
#define GLOBALS_H_

#include <stdio.h>

#include "z80/Z80.h"

extern char last_error[0x200];

#define ERROR(...) { \
    snprintf(last_error, sizeof last_error, __VA_ARGS__); \
    return false; \
}

#define KB *1024
#define MB KB*1024

#define RAM_PAGE_SZ 0x100

extern Z80 z80;

extern size_t sdcard_sz;
extern uint8_t* sd_data;
extern volatile uint8_t uart_last_keypress;

#endif
