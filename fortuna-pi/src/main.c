#include "window.h"

#include <stdbool.h>

/*
EMSCRIPTEN_KEEPALIVE bool sdl_frame()
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
 */

int main(int argc, char* argv[])
{
    (void) argc; (void) argv;

    sdl_init();
    window_init();

    while(1) {
        SDL_Event ev;
        while (SDL_PollEvent(&ev))
            if ((ev.type == SDL_QUIT) || (ev.type == SDL_KEYDOWN && ev.key.keysym.sym == SDLK_ESCAPE))
                goto done;
    }

done:
    sdl_destroy();

    return 0;
}