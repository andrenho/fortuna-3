#ifndef PALETTE_H_
#define PALETTE_H_

#include <stdint.h>
#include "SDL.h"

#define PALETTE_N_COLORS 16

#define COLOR_BLACK       0X0
#define COLOR_PURPLE      0X1
#define COLOR_RED         0X2
#define COLOR_ORANGE      0X3
#define COLOR_YELLOW      0X4
#define COLOR_LIME        0X5
#define COLOR_GREEN       0X6
#define COLOR_TURQUOISE   0X7
#define COLOR_DARK_BLUE   0X8
#define COLOR_BLUE        0X9
#define COLOR_LIGHT_BLUE  0XA
#define COLOR_CYAN        0XB
#define COLOR_WHITE       0XC
#define COLOR_LIGHT_GRAY  0XD
#define COLOR_GRAY        0XE
#define COLOR_DARK_GRAY   0XF

void      palette_init();
SDL_Color palette_color(uint8_t index);
void      palette_destroy();

#endif