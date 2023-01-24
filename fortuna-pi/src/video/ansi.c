#include "ansi.h"

#include <stdbool.h>
#include <ctype.h>

#define BUFFER_SZ 16

static char   buffer[BUFFER_SZ] = { 0 };
static bool   buffer_active = false;
static size_t buffer_len = 0;

AnsiCommand ansi_char(char chr)
{
    if (!buffer_active) {
        if (chr == 27)
            buffer_active = true;
    } else {
        buffer[buffer_len++] = chr;
        if (buffer[0] == '[' && isalpha(buffer[buffer_len-1])) {
            // split ';'
        }
    }
}