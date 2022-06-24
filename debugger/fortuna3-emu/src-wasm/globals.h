#ifndef GLOBALS_H_
#define GLOBALS_H_

#include <stdio.h>

extern char last_error[0x200];

#define ERROR(...) { \
    snprintf(last_error, sizeof last_error, __VA_ARGS__); \
    return false; \
}

extern size_t sdcard_sz;
extern uint8_t* sd_data;

#endif
