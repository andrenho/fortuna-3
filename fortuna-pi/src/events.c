#include "events.h"

#include <SDL.h>

#include "loop.h"
#include "video/text.h"
#include "interface/interface.h"

static uint32_t start_event = 0;
static bool need_to_be_freed[EVENT_COUNT] = { true };

void events_init()
{
    start_event = SDL_RegisterEvents(EVENT_COUNT);
    need_to_be_freed[E_CHANGE_BACKGROUND] = false;
    need_to_be_freed[E_TEXT_PRINT] = false;

    // SDL_StartTextInput();
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

static uint8_t translate_char(SDL_Keycode sym) {
    if (sym <= 255)
        return (uint8_t) sym;
    // TODO - add other keys such as F1, arrows, etc... (use VT100 codes)
    return 0;
}

void events_do(bool* quit)
{
    interface_uart_read();

    SDL_Event ev;
    while (SDL_PollEvent(&ev)) {

        // SDL Events

        if ((ev.type == SDL_QUIT) || (ev.type == SDL_KEYDOWN && ev.key.keysym.sym == SDLK_ESCAPE)) {
            *quit = true;
        } else if (ev.type == SDL_TEXTINPUT) {
            for (char* c = ev.text.text; *c; ++c)
                interface_uart_write(*c);
        } else if (ev.type == SDL_KEYDOWN && ev.key.state == SDL_PRESSED) {
            if (ev.key.keysym.sym < 32 || ev.key.keysym.sym > 126) {
                uint8_t c = translate_char(ev.key.keysym.sym);
                if (c)
                    interface_uart_write(c);
            }
        }

        // User events

        else if (ev.type == E_CHANGE_BACKGROUND + start_event) {
            loop_set_background((intptr_t) ev.user.data1);
        } else if (ev.type == E_TEXT_PRINT + start_event) {
            text_output((intptr_t) ev.user.data1);
        }

        // user event cleanup

        if (ev.type >= start_event && need_to_be_freed[ev.type]) {
            free(ev.user.data1);
        }
    }
}

void events_destroy()
{
}