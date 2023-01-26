#include "ansi.h"

#include <stdbool.h>
#include <ctype.h>
#include <string.h>
#include <stdlib.h>

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
    char buf1[3] = {0}, buf2[3] = {0};

    if (isalpha(buffer[1]))  // [X
        return;
    if (buffer[2] == ';' && isalpha(buffer[4])) {   // [1;2X
        buf1[0] = buffer[1];
        buf2[0] = buffer[3];
    } else if (buffer[2] == ';' && isalpha(buffer[5])) {   // [1;23X
        buf1[0] = buffer[1];
        buf2[0] = buffer[3];
        buf2[1] = buffer[4];
    } else if (buffer[3] == ';' && isalpha(buffer[5])) {   // [12;2X
        buf1[0] = buffer[1];
        buf1[1] = buffer[2];
        buf2[0] = buffer[4];
    } else if (buffer[3] == ';' && isalpha(buffer[6])) {   // [12;24X
        buf1[0] = buffer[1];
        buf1[1] = buffer[2];
        buf2[0] = buffer[4];
        buf2[1] = buffer[5];
    } else if (isalpha(buffer[2])) {   // [1X
        buf1[0] = buffer[1];
    } else if (isalpha(buffer[3])) {   // [12X
        buf1[0] = buffer[1];
        buf1[1] = buffer[2];
    }

    *p1 = strtol(buf1, NULL, 10);
    *p2 = strtol(buf2, NULL, 10);
}

static AnsiCommand ansi_parse_command(char command, int p1, int p2)
{
    switch (command) {
        case 'J':
            return (AnsiCommand) { .operation = A_CLRSCR };
        case 'H':
            return (AnsiCommand) { .operation = A_MOVETO, .par1 = p1, .par2 = p2 };
        case 'm':
            if (p1 == 0 && p2 == 0)
                return (AnsiCommand) { .operation = A_RESET };
            else
                return (AnsiCommand) { .operation = A_COLOR, .par1 = p1, .par2 = p2 };
        case 'A':
            return (AnsiCommand) { .operation = A_MOVE_UP, .par1 = p1 };
        case 'B':
            return (AnsiCommand) { .operation = A_MOVE_DOWN, .par1 = p1 };
        case 'C':
            return (AnsiCommand) { .operation = A_MOVE_RIGHT, .par1 = p1 };
        case 'D':
            return (AnsiCommand) { .operation = A_MOVE_LEFT, .par1 = p1 };
    }
    return ansi_rollback();
}

AnsiCommand ansi_char(char chr)
{
    if (!buffer_active) {
        if (chr == 27) {
            buffer_active = true;
            return (AnsiCommand) { .operation = A_START };
        }
    } else {
        buffer[buffer_len++] = chr;
        if (buffer_len == BUFFER_SZ) {
            return ansi_rollback();
        } else if (buffer[0] == '[' && isalpha(buffer[buffer_len-1])) {
            char command = buffer[buffer_len-1];
            int p1 = 0, p2 = 0;
            ansi_parse_parameters(&p1, &p2);
            AnsiCommand r = ansi_parse_command(command, p1, p2);
            ansi_clear_buffer();
            return r;
        }
    }

    return (AnsiCommand) { .operation = A_NOTHING };
}