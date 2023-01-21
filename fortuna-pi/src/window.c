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

static SDL_Window* window;

SDL_Renderer* renderer = NULL;

void window_init()
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

    window = SDL_CreateWindow(
            "Fortuna-3 emulator",
            SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
            640, 400,
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
}

EMSCRIPTEN_KEEPALIVE bool window_single_loop()
{
    SDL_Event ev;
    while (SDL_PollEvent(&ev))
        if ((ev.type == SDL_QUIT) || (ev.type == SDL_KEYDOWN && ev.key.keysym.sym == SDLK_ESCAPE))
            return false;

    text_update();

    SDL_SetRenderDrawColor(renderer, 26, 28, 44, SDL_ALPHA_OPAQUE);
    SDL_RenderClear(renderer);

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
    SDL_DestroyRenderer( renderer );
    SDL_DestroyWindow( window );
    SDL_Quit();
}
