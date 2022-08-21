#include "io/io.h"

#include <stdio.h>

#include "ops.h"
#include "uart.h"

void io_write(uint8_t addr, uint8_t data)
{
    switch (addr) {

        // serial

        case S_PUT:
            putchar(data);
            break;
    }
}

uint8_t io_read(uint8_t addr)
{
    switch (addr) {
        
        // serial

        case S_GET:
            return uart_getchar_nonblocking();

        case S_GET_BLK:
            return getchar();

    }
    return 0;
}

// vim:ts=4:sts=4:sw=4:expandtab
