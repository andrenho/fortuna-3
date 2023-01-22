#include "window.h"

#ifdef EMULATOR
#include <emscripten/emscripten.h>
#else
#define EMSCRIPTEN_KEEPALIVE
#endif

#include <SDL.h>

#include <stdio.h>
#include <stdbool.h>

#include "text.h"

static SDL_Window* window = NULL;
static float zoom = 1.f;
static int rel_x, rel_y;  // video output position relative to topleft border of monitor

SDL_Renderer* renderer = NULL;

#define SCR_W 320
#define SCR_H 200

static void sdl_init()
{
    SDL_Init(0);

    printf("Testing video drivers...\n");
    bool drivers[SDL_GetNumVideoDrivers()];
    for (int i = 0; i < SDL_GetNumVideoDrivers(); ++i)
    {
        drivers[i] = (0 == SDL_VideoInit(SDL_GetVideoDriver(i)));
        SDL_VideoQuit();
    }

    printf("SDL_VIDEODRIVER available:");
    for (int i = 0; i < SDL_GetNumVideoDrivers(); ++i) {
        printf(" %s", SDL_GetVideoDriver(i));
    }
    puts("");

    printf("SDL_VIDEODRIVER usable:");
    for (int i = 0; i < SDL_GetNumVideoDrivers(); ++i) {
        if(!drivers[i])
            continue;
        printf(" %s", SDL_GetVideoDriver(i));
    }
    puts("");

    if (SDL_Init(SDL_INIT_VIDEO) < 0)
    {
        fprintf(stderr, "SDL_Init(): %s\n", SDL_GetError());
        exit(EXIT_FAILURE);
    }
    printf("SDL_VIDEODRIVER selected: %s\n", SDL_GetCurrentVideoDriver());
}

static void find_zoom_and_rel(int desktop_w, int desktop_h, int* rel_x, int* rel_y, float* zoom)
{
    int zoom_w = desktop_w / SCR_W;
    int zoom_h = desktop_h / SCR_H;
    *zoom = (float) (zoom_w < zoom_h ? zoom_w : zoom_h);
    int w = SCR_W * (*zoom);
    int h = SCR_H * (*zoom);
    *rel_x = (desktop_w / 2) - (w / 2);
    *rel_y = (desktop_h / 2) - (h / 2);
}

static void window_and_renderer_init()
{
    SDL_DisplayMode mode;
    SDL_GetDesktopDisplayMode(0, &mode);
    printf("Desktop size is %dx%d.\n", mode.w, mode.h);

#ifdef EMULATOR
    int win_w = SCR_W * 2;
    int win_h = SCR_H * 2;
#else
    int win_w = mode.w;
    int win_h = mode.h;
#endif

    window = SDL_CreateWindow(
            "Fortuna-3 emulator",
            SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
            win_w, win_h,
            SDL_WINDOW_OPENGL
    );
    if (!window) {
        fprintf(stderr, "SDL_CreateWindow(): %s\n", SDL_GetError());
        exit(EXIT_FAILURE);
    }

    printf("SDL_RENDER_DRIVER available: ");
    for (int i = 0; i < SDL_GetNumRenderDrivers(); ++i) {
        SDL_RendererInfo info;
        SDL_GetRenderDriverInfo(i, &info);
        printf("%s ", info.name);
    }
    puts("");

    renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED | SDL_RENDERER_PRESENTVSYNC);
    if (!renderer) {
        fprintf(stderr, "SDL_CreateRenderer(): %s\n", SDL_GetError());
        exit(EXIT_FAILURE);
    }

    SDL_RendererInfo info;
    SDL_GetRendererInfo( renderer, &info );
    printf("SDL_RENDER_DRIVER selected: %s\n", info.name);

    find_zoom_and_rel(win_w, win_h, &rel_x, &rel_y, &zoom);
    printf("Zoom: %f, rel_x: %d, rel_y: %d\n", zoom, rel_x, rel_y);
}

void window_init()
{
    sdl_init();
    window_and_renderer_init();
}

static void window_adjust_size(float resolution)
{
    float zres = zoom * resolution;

    extern int SDL_RenderSetScale(SDL_Renderer*, float, float);
    SDL_RenderSetScale(renderer, zres, zres);

    SDL_Rect r = { rel_x / zres, rel_y / zres, SCR_W, SCR_H };
    SDL_RenderSetViewport(renderer, &r);
}

EMSCRIPTEN_KEEPALIVE bool window_single_loop()
{
    // events
    SDL_Event ev;
    while (SDL_PollEvent(&ev))
        if ((ev.type == SDL_QUIT) || (ev.type == SDL_KEYDOWN && ev.key.keysym.sym == SDLK_ESCAPE))
            return false;

    // updates
    text_update();

    // redraws
    SDL_Rect rect = { 1, 1, 3, 3 };

    window_adjust_size(1);
    SDL_SetRenderDrawColor(renderer, 26, 28, 44, SDL_ALPHA_OPAQUE);
    SDL_RenderClear(renderer);

    SDL_SetRenderDrawColor(renderer, 255, 255, 255, SDL_ALPHA_OPAQUE);
    SDL_RenderDrawRect(renderer, &rect);

    SDL_Rect r2 = { 319, 199, 1, 1 };
    SDL_SetRenderDrawColor(renderer, 0, 255, 0, SDL_ALPHA_OPAQUE);
    SDL_RenderDrawRect(renderer, &r2);

    window_adjust_size(0.5f);
    SDL_SetRenderDrawColor(renderer, 255, 0, 0, SDL_ALPHA_OPAQUE);
    SDL_RenderDrawRect(renderer, &rect);

    text_draw();

    SDL_RenderPresent(renderer);
    // SDL_Delay(16);

    return true;
}

void window_main_loop()
{
    while (window_single_loop());
}

void window_destroy()
{
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
}
