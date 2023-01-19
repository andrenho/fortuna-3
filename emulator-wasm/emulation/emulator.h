#ifndef EMULATOR_H_
#define EMULATOR_H_

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

typedef enum { NORMAL = 0, BREAKPOINT = 1 } FinishReason;

bool         emulator_initialize(size_t sdcard_sz_in_mb);
uint16_t     emulator_step();
FinishReason emulator_step_cycles(int cycles);
FinishReason emulator_next();
void         emulator_keypress(uint8_t chr);

#endif