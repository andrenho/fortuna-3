#include "palette.h"

static SDL_Color palette[PALETTE_N_COLORS] = { 0 };

void palette_init()
{
#define SET_COLOR(n, color) palette[n] = (SDL_Color) { (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff, 255 };
    SET_COLOR(COLOR_BLACK,      0x1a1c2c)
    SET_COLOR(COLOR_PURPLE,     0x5d275d)
    SET_COLOR(COLOR_RED,        0xb13e53)
    SET_COLOR(COLOR_ORANGE,     0xef7d57)
    SET_COLOR(COLOR_YELLOW,     0xffcd75)
    SET_COLOR(COLOR_LIME,       0xa7f070)
    SET_COLOR(COLOR_GREEN,      0x38b764)
    SET_COLOR(COLOR_TURQUOISE,  0x257179)
    SET_COLOR(COLOR_DARK_BLUE,  0x29366f)
    SET_COLOR(COLOR_BLUE,       0x3b5dc9)
    SET_COLOR(COLOR_LIGHT_BLUE, 0x41a6f6)
    SET_COLOR(COLOR_CYAN,       0x73eff7)
    SET_COLOR(COLOR_WHITE,      0xf4f4f4)
    SET_COLOR(COLOR_LIGHT_GRAY, 0x94b0c2)
    SET_COLOR(COLOR_GRAY,       0x566c86)
    SET_COLOR(COLOR_DARK_GRAY,  0x333c57)
#undef SET_COLOR
}

SDL_Color palette_color(uint8_t index)
{
    return palette[index % PALETTE_N_COLORS];
}

void palette_destroy()
{
}