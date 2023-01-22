#include "text.h"

#include "SDL.h"
#include <stdio.h>

#include "font.h"
#include "palette.h"

extern SDL_Renderer* renderer;

static SDL_Texture* font = NULL;

uint8_t matrix[TEXT_LINES][TEXT_COLUMNS];

static void text_load_font()
{
    SDL_RWops* io = SDL_RWFromConstMem(font_bmp, (int) font_bmp_len);
    SDL_Surface* sf = SDL_LoadBMP_RW(io, 1);
    if (!sf) {
        fprintf(stderr, "SDL_LoadBMP_RW: %s\n", SDL_GetError());
    }

    SDL_SetColorKey(sf, SDL_RLEACCEL, 0);
    font = SDL_CreateTextureFromSurface(renderer, sf);
    // SDL_SetTextureBlendMode(font, SDL_BLENDMODE_MOD);

    SDL_FreeSurface(sf);
}

void text_init()
{
    text_load_font();
    for (size_t line = 0; line < TEXT_LINES; ++line)
        for (size_t column = 0; column < TEXT_COLUMNS; ++column)
            matrix[line][column] = 'A';  // TODO
}

void text_update()
{
}

void text_draw()
{
    SDL_Color fg = palette_color(COLOR_WHITE);
    SDL_SetTextureColorMod(font, fg.r, fg.g, fg.b);

    for (size_t line = 0; line < TEXT_LINES; ++line) {
        for (size_t column = 0; column < TEXT_COLUMNS; ++column) {
            uint8_t c = matrix[line][column];
            int orig_x = (c / 16) * TEXT_CHAR_W;
            int orig_y = (c % 16) * TEXT_CHAR_H;
            int dest_x = TEXT_BORDER + (column * TEXT_CHAR_W);
            int dest_y = TEXT_BORDER + (line * TEXT_CHAR_H);
            SDL_RenderCopy(renderer, font,
                           &(SDL_Rect) { orig_x, orig_y, TEXT_CHAR_W, TEXT_CHAR_H },
                           &(SDL_Rect) { dest_x, dest_y, TEXT_CHAR_W, TEXT_CHAR_H });
        }
    }
}

void text_destroy()
{
    SDL_DestroyTexture(font);
}