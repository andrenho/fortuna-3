#include "text.h"

#include "SDL.h"
#include <stdio.h>
#include <string.h>

#include "font.h"
#include "palette.h"
#include "../loop.h"

#define TEXT_COLUMNS ((SCREEN_W * 2 - TEXT_BORDER_X * 2) / TEXT_CHAR_W)
#define TEXT_LINES   ((SCREEN_H * 2 - TEXT_BORDER_Y * 2) / TEXT_CHAR_H)

static SDL_Texture* font = NULL;

static uint8_t matrix[TEXT_LINES][TEXT_COLUMNS];
static uint8_t color = COLOR_WHITE;

#define BUFFER_SZ 12
static uint8_t buffer[BUFFER_SZ];
static uint8_t buffer_len = 0;
static bool    buffer_mode = false;

typedef struct {
    uint8_t x;
    uint8_t y;
    uint8_t color : 4;
    bool visible;
    bool blink_state;
} Cursor;
static Cursor cursor = { .x = 0, .y = 0, .color = COLOR_ORANGE, .visible = true, .blink_state = true };

static void text_load_font()
{
    SDL_RWops* io = SDL_RWFromConstMem(font_bmp, (int) font_bmp_len);
    SDL_Surface* sf = SDL_LoadBMP_RW(io, 1);
    if (!sf) {
        fprintf(stderr, "SDL_LoadBMP_RW: %s\n", SDL_GetError());
    }

    SDL_SetColorKey(sf, SDL_RLEACCEL, 0);
    font = SDL_CreateTextureFromSurface(renderer, sf);

    SDL_FreeSurface(sf);
}

void text_init()
{
    text_load_font();
    for (size_t line = 0; line < TEXT_LINES; ++line)
        for (size_t column = 0; column < TEXT_COLUMNS; ++column)
            matrix[line][column] = ' ';
}

static void text_advance_line()
{
    cursor.x = 0;
    ++cursor.y;
    if (cursor.y >= TEXT_LINES) {
        for (size_t y = 0; y < (TEXT_LINES - 1); ++y)
            memcpy(matrix[y], matrix[y+1], TEXT_COLUMNS);
        --cursor.y;
        memset(matrix[cursor.y], ' ', TEXT_COLUMNS);
    }
}

static void text_advance_cursor()
{
    ++cursor.x;
    if (cursor.x >= TEXT_COLUMNS)
        text_advance_line();
}

static bool text_buffer_is_ansi(const char* cmd)
{
    return strlen(cmd) == buffer_len && strncmp((const char *) buffer, cmd, buffer_len) == 0;
}

static bool text_check_buffer_for_ansi()
{
    if (text_buffer_is_ansi("\e[2J")) {  // clear screen
        for (size_t y = 0; y < TEXT_LINES; ++y)
            for (size_t x = 0; x < TEXT_COLUMNS; ++x)
                matrix[y][x] = ' ';
        return true;
    } else if (text_buffer_is_ansi("\e[1;1H")) {   // home
        cursor.x = cursor.y = 0;
        return true;
    } else if (text_buffer_is_ansi("\e[0m")) {   // reset formatting
        color = COLOR_WHITE;
        return true;
    } else if (text_buffer_is_ansi("\e[1;32m")) {   // color: green
        color = COLOR_GREEN;
        return true;
    }
    return false;
}

static void text_parse_buffer(uint8_t c)
{
    if (buffer_len == BUFFER_SZ) {
        buffer_mode = false;
        buffer_len = 0;
        text_output('^');
        text_output('[');
        for (size_t i = 1; i < BUFFER_SZ; ++i)
            text_output(buffer[i]);
        text_output(c);
    } else {
        buffer[buffer_len++] = c;
        if (text_check_buffer_for_ansi()) {
            buffer_mode = false;
            buffer_len = 0;
        }
    }
}

void text_output(uint8_t c)
{
    if (buffer_mode) {
        text_parse_buffer(c);
    } else {
        switch (c) {
            case '\r':
                break;
            case '\n':
                text_advance_line();
                break;
            case '\b':
                if (cursor.x > 0)
                    --cursor.x;
                break;
            case 27:  // ESC
                buffer_mode = true;
                buffer[buffer_len++] = c;
                break;
            default:
                matrix[cursor.y][cursor.x] = c;
                text_advance_cursor();
                break;
        }
    }
}

static void text_draw_cell(size_t line, size_t column)
{
    uint8_t c = matrix[line][column];

    int orig_x = (c / 16) * TEXT_CHAR_W;
    int orig_y = (c % 16) * TEXT_CHAR_H;
    int dest_x = TEXT_BORDER_X + (column * TEXT_CHAR_W);
    int dest_y = TEXT_BORDER_Y + (line * TEXT_CHAR_H);

    if (cursor.x == column && cursor.y == line && cursor.visible && cursor.blink_state) {
        SDL_Color cg = palette_color(cursor.color);
        SDL_SetRenderDrawColor(renderer, cg.r, cg.g, cg.b, SDL_ALPHA_OPAQUE);
        SDL_RenderFillRect(renderer, &(SDL_Rect) { dest_x, dest_y, TEXT_CHAR_W, TEXT_CHAR_H });

        SDL_Color bg = palette_color(loop_background());
        SDL_SetTextureColorMod(font, bg.r, bg.g, bg.b);

    } else {
        SDL_Color fg = palette_color(color);
        SDL_SetTextureColorMod(font, fg.r, fg.g, fg.b);
    }

    if (c != 0 && c != 32) {
        SDL_RenderCopy(renderer, font,
                       &(SDL_Rect) { orig_x, orig_y, TEXT_CHAR_W, TEXT_CHAR_H },
                       &(SDL_Rect) { dest_x, dest_y, TEXT_CHAR_W, TEXT_CHAR_H });
    }
}

void text_update()
{
    cursor.blink_state = (SDL_GetTicks() / TEXT_BLINK_DELAY) & 1;
}

void text_draw()
{
    SDL_Color fg = palette_color(COLOR_WHITE);
    SDL_SetTextureColorMod(font, fg.r, fg.g, fg.b);

    for (size_t line = 0; line < TEXT_LINES; ++line)
        for (size_t column = 0; column < TEXT_COLUMNS; ++column)
            text_draw_cell(line, column);
}

void text_destroy()
{
    SDL_DestroyTexture(font);
}

