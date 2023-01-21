#include "text.h"

#include <SDL.h>
#include <stdio.h>

#include "font.h"

extern SDL_Renderer* renderer;

static SDL_Texture* font = NULL;

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
}

void text_update()
{
}

void text_draw()
{
}

void text_destroy()
{
    SDL_DestroyTexture(font);
}