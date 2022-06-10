#include "z80/Z80.h"

Z80 z80 = { 0 };

void fortuna_init()
{
	ResetZ80(&z80);
}

// vim: ts=4:sts=4:sw=4:noexpandtab
