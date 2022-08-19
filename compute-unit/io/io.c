#include "io/io.h"

#include <stdio.h>

void io_write(uint8_t addr, uint8_t data)
{
    switch (addr) {
        case 0x0:  // SER_OUT
            putchar(data);
            break;
    }
}

uint8_t io_read(uint8_t addr)
{
    switch (addr) {
    }
    return 0;
}

// vim:ts=4:sts=4:sw=4:expandtab
