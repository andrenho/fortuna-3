#include "events.h"

#include <SDL.h>

#include "loop.h"

static uint32_t start_event = 0;
static bool need_to_be_freed[EVENT_COUNT] = { true };

void events_init()
{
    start_event = SDL_RegisterEvents(EVENT_COUNT);
    need_to_be_freed[E_CHANGE_BACKGROUND] = false;
    need_to_be_freed[E_TEXT_OUTPUT] = false;
}

void events_push(EventType event_type, void* data)
{
    SDL_Event event = {
        .user = (SDL_UserEvent) {
            .type = event_type + start_event,
            .data1 = data,
            .data2 = (void *) need_to_be_freed[event_type]
        }
    };
    SDL_PushEvent(&event);
}

void events_do(bool* quit)
{
    SDL_Event ev;
    while (SDL_PollEvent(&ev)) {
        if ((ev.type == SDL_QUIT) || (ev.type == SDL_KEYDOWN && ev.key.keysym.sym == SDLK_ESCAPE)) {
            *quit = true;
        } else if (ev.type == E_CHANGE_BACKGROUND + start_event) {
            loop_set_background((uint8_t) ev.user.data1);
        }
    }
}

void events_destroy()
{
}