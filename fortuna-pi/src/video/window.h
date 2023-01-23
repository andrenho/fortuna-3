#ifndef WINDOW_H
#define WINDOW_H

#include "SDL.h"
#include <stdbool.h>

#define SCREEN_W 128
#define SCREEN_H 128

void window_init();
void window_size(int* w, int* h);
void window_destroy();

extern SDL_Renderer* renderer;

#endif
