#include "events.h"

#include <SDL.h>

static uint32_t start_event = 0;

void events_init()
{
    start_event = SDL_RegisterEvents(EVENT_COUNT);
}

void events_push(EventType event_type, void* data, bool need_to_be_freed)
{
    SDL_Event event = {
        .user = (SDL_UserEvent) {
            .type = event_type + start_event,
            .data1 = data,
            .data2 = (void *) need_to_be_freed,
        }
    };
    SDL_PushEvent(&event);
}

void events_destroy()
{
}