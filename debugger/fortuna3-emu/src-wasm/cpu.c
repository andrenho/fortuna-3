#include "z80/Z80.h"

#include "ram.h"

word LoopZ80(Z80 *R)
{
    (void) R;
    return INT_QUIT;
}

void OutZ80(word port, byte value)
{
    (void) port; (void) value;
}

byte InZ80(word port)
{
    (void) port;
    return 0;
}

void WrZ80(word addr, byte value)
{
    ram_set(addr, value);
}

byte RdZ80(word addr)
{
    return ram_get(addr);
}

void PatchZ80(Z80 *R)
{
    (void) R;
}

// vim: ts=4:sts=4:sw=4:expandtab
