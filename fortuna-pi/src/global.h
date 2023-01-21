#ifndef GLOBAL_H_
#define GLOBAL_H_

#ifdef EMULATOR
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

#include <SDL.h>

extern SDL_Window* window;
extern SDL_Renderer* renderer;

#endif