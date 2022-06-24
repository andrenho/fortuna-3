#include "emulator.h"

Z80 z80 = { 0 };

void emulator_init()
{
	ResetZ80(&z80);
}

Z80 const* emulator_z80()
{
    return &z80;
}

// vim: ts=4:sts=4:sw=4:noexpandtab
