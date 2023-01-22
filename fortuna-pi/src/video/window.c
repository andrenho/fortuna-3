#include "window.h"

#include "SDL.h"

#include <stdio.h>
#include <stdbool.h>

static SDL_Window* window = NULL;

SDL_Renderer* renderer = NULL;

static int win_w = 0, win_h = 0;

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

static void window_and_renderer_init()
{
    SDL_DisplayMode mode;
    SDL_GetDesktopDisplayMode(0, &mode);
    printf("Desktop size is %dx%d.\n", mode.w, mode.h);

#ifdef EMULATOR
    win_w = SCREEN_W * 2;
    win_h = SCREEN_H * 2;
#else
    win_w = mode.w;
    win_h = mode.h;
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
#ifndef EMULATOR
    SDL_ShowCursor(SDL_DISABLE);
#endif

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
}

void window_init()
{
    sdl_init();
    window_and_renderer_init();
}

void window_size(int* w, int* h)
{
    *w = win_w;
    *h = win_h;
}

void window_destroy()
{
    SDL_DestroyRenderer(renderer);
    SDL_DestroyWindow(window);
    SDL_Quit();
}
