#include <emscripten/emscripten.h>

#include "terminal.h"

#include <stdlib.h>
#include <string.h>

size_t printed_chars_idx = 0;
uint8_t printed_chars[MAX_PRINTED_CHARS] = { 0 };

void terminal_printchar(uint8_t value)
{
    if (printed_chars_idx < MAX_PRINTED_CHARS)
        printed_chars[printed_chars_idx++] = value;
}

EMSCRIPTEN_KEEPALIVE size_t terminal_unload_printed_chars(uint8_t* data, size_t max_sz)
{
    memcpy(data, printed_chars, max_sz);
    size_t r = printed_chars_idx;
    printed_chars_idx = 0;
    return r;
}

uint8_t terminal_getchar()
{
    // TODO
    return 0;
}

// vim: ts=4:sts=4:sw=4:expandtab
