#include <emscripten/emscripten.h>


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

EMSCRIPTEN_KEEPALIVE ram_data(uint16_t block, uint8_t data[256])
{
}
