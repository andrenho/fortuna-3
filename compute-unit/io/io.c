#include "io/io.h"

#include <stdio.h>

#include "dev/uart.h"
#include "io/ops.h"
#include "io/serial.h"
#include "io/ioregs.h"

static IO_Regs ioregs;

void io_write(uint8_t addr, uint8_t data)
{
    if (addr <= 0xb) {
        ((uint8_t*) &ioregs)[addr] = data;
    }

    switch (addr) {

        // serial

        case S_PUT:
            putchar(data);
            break;

        case S_PRINT_Z:
            io_serial_print_z(&ioregs);
            break;

        case S_PRINT_LEN:
            io_serial_print_len(&ioregs);
            break;
    }
}

uint8_t io_read(uint8_t addr)
{
    if (addr <= 0xb) {
        return ((uint8_t*) &ioregs)[addr];
    }

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
