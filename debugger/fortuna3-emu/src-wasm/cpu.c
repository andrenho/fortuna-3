#include <emscripten/emscripten.h>
#include <stdio.h>

#include "z80/Z80.h"
#include "cpu.h"
#include "uart.h"

#include "dev/ram.h"
#include "io/io.h"

uint16_t bkp[MAX_BKPS];

EMSCRIPTEN_KEEPALIVE void bkp_clear()
{
    for (size_t i = 0; i < MAX_BKPS; ++i)
        bkp[i] = 0;
}

EMSCRIPTEN_KEEPALIVE void bkp_add(uint16_t addr)
{
    for (size_t i = 0; i < MAX_BKPS; ++i)
        if (bkp[i] == addr)
            return;

    for (size_t i = 0; i < MAX_BKPS; ++i) {
        if (bkp[i] == 0) {
            bkp[i] = addr;
            return;
        }
    }
}

EMSCRIPTEN_KEEPALIVE void bkp_del(uint16_t addr)
{
    for (size_t i = 0; i < MAX_BKPS; ++i)
        if (bkp[i] == addr)
            bkp[i] = 0;
}

word LoopZ80(Z80 *R)
{
    (void) R;
    return INT_QUIT;
}

void OutZ80(word port, byte value)
{
    io_write(port, value);
    io_write_bus(port, value);
}

byte InZ80(word port)
{
    return io_read(port);
}

void WrZ80(word addr, byte value)
{
    ram_set_byte(addr, value);
}

byte RdZ80(word addr)
{
    return ram_get_byte(addr);
}

void PatchZ80(Z80 *R)
{
    (void) R;
}

// vim: ts=4:sts=4:sw=4:expandtab
