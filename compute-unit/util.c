#include "util.h"

#include <stdio.h>

void printbin(uint8_t value)
{
    for (int i = 7; i >= 0; --i)
        putchar(((value >> i) & 1) ? '1' : '0');
    putchar('\n');
}

// vim:ts=4:sts=4:sw=4:expandtab
