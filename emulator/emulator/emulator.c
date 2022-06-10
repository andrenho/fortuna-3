#include "emulator.h"

static Z80 z80_ = { 0 };
static uint8_t ram_[512 * 1024];

void emulator_init()
{
	ResetZ80(&z80_);
}

Z80 const* emulator_z80()
{
    return &z80_;
}

uint8_t const* emulator_ram_page(uint8_t page)
{
    return &ram_[page * RAM_PAGE_SZ];
}

// vim: ts=4:sts=4:sw=4:noexpandtab
