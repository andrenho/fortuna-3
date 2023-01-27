#include "text.h"

#include "SDL.h"
#include <stdio.h>
#include <string.h>

#include "font.h"
#include "palette.h"
#include "../loop.h"
#include "ansi.h"

#define TEXT_COLUMNS ((SCREEN_W * 2 - TEXT_BORDER_X * 2) / TEXT_CHAR_W)
#define TEXT_LINES   ((SCREEN_H * 2 - TEXT_BORDER_Y * 2) / TEXT_CHAR_H)

static SDL_Texture* font = NULL;

static void text_execute_ansi_command(AnsiCommand command);

typedef struct {
    uint8_t c;
    uint8_t color : 4;
} Char;

static Char matrix[TEXT_LINES][TEXT_COLUMNS];
static uint8_t color = COLOR_WHITE;

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
    text_reset();
}

void text_reset()
{
    cursor = (Cursor) { .x = 0, .y = 0, .color = COLOR_ORANGE, .visible = true, .blink_state = true };
    color = COLOR_WHITE;

    for (size_t line = 0; line < TEXT_LINES; ++line)
        for (size_t column = 0; column < TEXT_COLUMNS; ++column)
            matrix[line][column] = (Char) { ' ', color };
}

static void text_advance_line()
{
    cursor.x = 0;
    ++cursor.y;
    if (cursor.y >= TEXT_LINES) {
        for (size_t y = 0; y < (TEXT_LINES - 1); ++y)
            memcpy(matrix[y], matrix[y+1], TEXT_COLUMNS * sizeof(Char));
        --cursor.y;
        for (size_t x = 0; x < TEXT_COLUMNS; ++x)
            matrix[cursor.y][x] = (Char) { ' ', color };
    }
}

static void text_advance_cursor()
{
    ++cursor.x;
    if (cursor.x >= TEXT_COLUMNS)
        text_advance_line();
}

void text_output(uint8_t c)
{
    bool aa = ansi_active();

    AnsiCommand ansi_command = ansi_char((char) c);
    text_execute_ansi_command(ansi_command);

    if (!aa) {
        switch (c) {
            case '\r':
            case 27:  // ESC
                break;
            case '\n':
                text_advance_line();
                break;
            case '\b':
                if (cursor.x > 0) {
                    --cursor.x;
                    matrix[cursor.y][cursor.x] = (Char) { ' ', color };
                }
                break;
            default:
                matrix[cursor.y][cursor.x] = (Char) { c, color };
                text_advance_cursor();
                break;
        }
    }
}

static void text_draw_cell(size_t line, size_t column)
{
    Char chr = matrix[line][column];
    uint8_t c = chr.c;

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
        SDL_Color fg = palette_color(chr.color);
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

static uint8_t text_ansi_color(int number)
{
    switch (number) {
        case 30: return COLOR_BLACK;
        case 31: return COLOR_RED;
        case 32: return COLOR_GREEN;
        case 33: return COLOR_ORANGE;
        case 34: return COLOR_DARK_BLUE;
        case 35: return COLOR_PURPLE;
        case 36: return COLOR_TURQUOISE;
        case 37: return COLOR_LIGHT_GRAY;
        case 90: return COLOR_GRAY;
        case 91: return COLOR_ORANGE;
        case 92: return COLOR_LIME;
        case 93: return COLOR_YELLOW;
        case 94: return COLOR_LIGHT_BLUE;
        case 95: return COLOR_BLUE;
        case 96: return COLOR_CYAN;
        case 97: return COLOR_WHITE;
        default: return color;
    }
}

static void text_execute_ansi_command(AnsiCommand command) {

    switch (command.operation) {

        case A_NOTHING:
        case A_START:
            break;

        case A_ROLLBACK: {
            text_output('^');
            for (const char *s = command.str; *s; ++s)
                text_output(*s);
            break;
        }

        case A_CLRSCR:
            for (size_t y = 0; y < TEXT_LINES; ++y)
                for (size_t x = 0; x < TEXT_COLUMNS; ++x)
                    matrix[y][x].c = ' ';
            break;

        case A_MOVETO:
            if ((command.par1 - 1) < TEXT_LINES && (command.par2 - 1) < TEXT_COLUMNS) {
                cursor.x = command.par2 - 1;
                cursor.y = command.par1 - 1;
            }
            break;

        case A_COLOR:
            color = text_ansi_color(command.par2);
            break;

        case A_RESET:
            color = COLOR_WHITE;
            break;

        case A_MOVE_UP:
            if (cursor.y - command.par1 >= 0)
                cursor.y -= command.par1;
            break;

        case A_MOVE_DOWN:
            if (cursor.y + command.par1 < TEXT_LINES)
                cursor.y += command.par1;
            break;

        case A_MOVE_LEFT:
            if (cursor.x - command.par1 >= 0)
                cursor.x -= command.par1;
            break;

        case A_MOVE_RIGHT:
            if (cursor.x + command.par1 < TEXT_COLUMNS)
                cursor.x += command.par1;
            break;
    }
}
