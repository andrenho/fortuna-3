#ifndef ANSI_H_
#define ANSI_H_

#include <stdint.h>

typedef enum {
    A_NOTHING, A_START, A_NO_MATCH,
    A_CLRSCR, A_MOVETO, A_COLOR, A_RESET, A_MOVE_UP, A_MOVE_DOWN, A_MOVE_LEFT, A_MOVE_RIGHT,
} AnsiOperation;

typedef struct {
    AnsiOperation operation;
    union {
        struct {
            uint8_t par1;
            uint8_t par2;
        };
        const char* str;
    };
} AnsiCommand;

AnsiCommand ansi_char(char chr);

#endif