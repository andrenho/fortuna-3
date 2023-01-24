#include "ansi.h"

#include <stdbool.h>
#include <ctype.h>
#include <string.h>

#define BUFFER_SZ 16

static char   buffer[BUFFER_SZ] = { 0 };
static char   return_buffer[BUFFER_SZ] = { 0 };
static bool   buffer_active = false;
static size_t buffer_len = 0;

bool ansi_active()
{
    return buffer_active;
}

static void ansi_clear_buffer()
{
    buffer_active = false;
    buffer_len = 0;
    memset(buffer, 0, BUFFER_SZ);
}

static AnsiCommand ansi_rollback()
{
    memcpy(return_buffer, buffer, BUFFER_SZ);
    ansi_clear_buffer();
    return (AnsiCommand) { .operation = A_ROLLBACK, .str = return_buffer };
}

static void ansi_parse_parameters(int* p1, int* p2)
{
}

static AnsiCommand ansi_parse_command(char command, int p1, int p2)
{
    return ansi_rollback();
}

AnsiCommand ansi_char(char chr)
{
    if (!buffer_active) {
        if (chr == 27) {
            buffer_active = true;
            return (AnsiCommand) { A_START };
        }
    } else {
        buffer[buffer_len++] = chr;
        if (buffer_len == BUFFER_SZ) {
            return ansi_rollback();
        } else if (buffer[0] == '[' && isalpha(buffer[buffer_len-1])) {
            char command = buffer[buffer_len-1];
            int p1, p2;
            ansi_parse_parameters(&p1, &p2);
            AnsiCommand r = ansi_parse_command(command, p1, p2);
            ansi_clear_buffer();
            return r;
        }
    }

    return (AnsiCommand) { A_NOTHING };
}