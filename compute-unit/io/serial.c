#include "io/serial.h"

#include <stdio.h>

#include "dev/ram.h"

void io_serial_print_z(IO_Regs* r)
{
    uint16_t addr = Pa(r);
    for (;;) {
        uint8_t chr = ram_get_byte(addr++);
        if (chr == 0)
            return;
        putchar(chr);
    }
}

void io_serial_print_len(IO_Regs* r)
{
    uint16_t addr = Pa(r);
    uint16_t sz = Pb(r);
    for (uint16_t i = addr; i < (addr + sz); ++i)
        putchar(ram_get_byte(i));
}

// vim:ts=4:sts=4:sw=4:expandtab
