#include "loop.h"

#include <stdbool.h>
#include <stdio.h>
#include <SDL.h>

#include "events.h"
#include "interface/interface.h"
#include "video/text.h"
#include "video/window.h"
#include "video/palette.h"

#ifdef EMULATOR
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

static int zoom = 1;
static int relative_x, relative_y;  // video output position relative to topleft border of monitor
static uint8_t background = COLOR_BLACK;

void loop_init()
{
    int win_w, win_h;
    window_size(&win_w, &win_h);

    // find zoom and relative position
    int zoom_w = win_w / (SCREEN_W * 2);
    int zoom_h = win_h / (SCREEN_H * 2);
    zoom = zoom_w < zoom_h ? zoom_w : zoom_h;
    int w = SCREEN_W * 2 * zoom;
    int h = SCREEN_H * 2 * zoom;
    relative_x = (win_w / 2) - (w / 2);
    relative_y = (win_h / 2) - (h / 2);

    printf("Zoom: %d, relative_x: %d, relative_y: %d\n", zoom, relative_x, relative_y);
}

static void loop_adjust_viewport(int resolution)
{
#ifdef EMULATOR
    int zres = zoom * resolution;

    extern int SDL_RenderSetScale(SDL_Renderer*, float, float);
    SDL_RenderSetScale(renderer, (float) zres, (float) zres);

    SDL_Rect r = {
        (int) ((float) relative_x / (float) zres),
        (int) ((float) relative_y / (float) zres),
        SCREEN_W * 2,
        SCREEN_H * 2
    };
    SDL_RenderSetViewport(renderer, &r);
#else
    SDL_RenderSetLogicalSize(renderer, SCREEN_W * 2 / resolution, SCREEN_H * 2 / resolution);
#endif
}

static void loop_redraw()
{
    // deep background
    SDL_SetRenderDrawColor(renderer, 0, 0, 0, SDL_ALPHA_OPAQUE);
    SDL_RenderClear(renderer);

    // screen background
    loop_adjust_viewport(2);
    SDL_Color bg = palette_color(background);
    SDL_SetRenderDrawColor(renderer, bg.r, bg.g, bg.b, SDL_ALPHA_OPAQUE);
    SDL_RenderFillRect(renderer, &(SDL_Rect) {0, 0, SCREEN_W, SCREEN_H });

    // layers
    loop_adjust_viewport(1);
    text_draw();

    SDL_RenderPresent(renderer);
    // SDL_Delay(16);
}

uint8_t loop_background()
{
    return background;
}

void loop_set_background(uint8_t bg)
{
    background = bg;
}

EMSCRIPTEN_KEEPALIVE bool loop_single()
{
    bool quit = false;
    events_do(&quit);

    text_update();

    loop_redraw();

    return !quit;
}

void loop()
{
    interface_run_thread();
    while (loop_single());
}

void loop_reset()
{
    background = COLOR_BLACK;
    loop_redraw();
}

void loop_destroy()
{
}

