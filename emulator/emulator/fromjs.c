#include <emscripten/emscripten.h>

#include <stddef.h>
#include <stdint.h>


EMSCRIPTEN_KEEPALIVE void initialize(/* callbacks */)
{
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

EMSCRIPTEN_KEEPALIVE void ram_data(uint16_t block, uint8_t data[256])
{
	for (size_t i = 0; i < 256; ++i)
		data[i] = i;
}

// vim: ts=4:sts=4:sw=4:noexpandtab
