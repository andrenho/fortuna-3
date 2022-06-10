#include <emscripten/emscripten.h>

#include <stddef.h>
#include <stdint.h>
#include <string.h>

#include "emulator.h"

EMSCRIPTEN_KEEPALIVE void initialize()
{
    emulator_init();
}

EMSCRIPTEN_KEEPALIVE void reset()
{
}

EMSCRIPTEN_KEEPALIVE void step()
{
}

EMSCRIPTEN_KEEPALIVE void step_n(int n)
{
}

/*
EMSCRIPTEN_KEEPALIVE CPUInfo cpu_info()
{
}
*/

EMSCRIPTEN_KEEPALIVE void ram_data(uint16_t page, uint8_t* data)
{
    memcpy(data, emulator_ram_page(page), RAM_PAGE_SZ);
}

// vim: ts=4:sts=4:sw=4:noexpandtab
