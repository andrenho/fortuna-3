#include <SDL.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

static SDL_Window* window;
static SDL_Renderer* renderer;
static unsigned char i = 0;

static void init_sdl()
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

    if (SDL_Init(SDL_INIT_EVERYTHING) < 0)
    {
        fprintf(stderr, "SDL_Init(): %s\n", SDL_GetError());
        exit(EXIT_FAILURE);
    }
    printf("SDL_VIDEODRIVER selected: %s\n", SDL_GetCurrentVideoDriver());

    window = SDL_CreateWindow(
            "SDL2",
            SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED,
            640, 480,
            SDL_WINDOW_SHOWN
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

    renderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
    if (!renderer) {
        fprintf(stderr, "SDL_CreateRenderer(): %s\n", SDL_GetError());
        exit(EXIT_FAILURE);
    }

    SDL_RendererInfo info;
    SDL_GetRendererInfo( renderer, &info );
    printf("SDL_RENDER_DRIVER selected: %s\n", info.name);

}

void stop_sdl()
{
    SDL_DestroyRenderer( renderer );
    SDL_DestroyWindow( window );
    SDL_Quit();
}

bool sdl_frame()
{
    SDL_Event ev;
    while( SDL_PollEvent( &ev ) )
    {
        if( ( ev.type == SDL_QUIT ) ||
            ( ev.type == SDL_KEYDOWN && ev.key.keysym.sym == SDLK_ESCAPE ) )
        {
            return false;
        }
    }

    SDL_SetRenderDrawColor( renderer, i % 255, ((i + 64) * 2) % 255, ((i + 128) / 2) % 255, SDL_ALPHA_OPAQUE );
    SDL_RenderClear( renderer );
    SDL_RenderPresent( renderer );
    SDL_Delay(16);
    i++;

    return true;
}

int main(int argc, char* argv[])
{
    (void) argc; (void) argv;

    init_sdl();
    while(sdl_frame());
    stop_sdl();

    return 0;
}
