#include "events.h"

#include <SDL.h>

#include "loop.h"
#include "video/text.h"
#include "interface/interface.h"

static uint32_t start_event = 0;

void events_init()
{
    start_event = SDL_RegisterEvents(EVENT_COUNT);
    // SDL_StartTextInput();
}

void events_reset()
{
}

void events_push(EventType event_type, void* data)
{
    SDL_Event event = {
        .user = (SDL_UserEvent) {
            .type = event_type + start_event,
            .data1 = data,
        }
    };
    SDL_PushEvent(&event);
}

static uint8_t translate_char(SDL_Keycode sym, uint8_t buffer[16]) {

    switch (sym) {
        case SDLK_KP_ENTER:
        case SDLK_RETURN:
            buffer[0] = 10;
            return 1;
    }

    if (sym > 0 && sym <= 255) {
        buffer[0] = (uint8_t) sym;
        return 1;
    }

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
                static uint8_t buffer[16] = {0};
                uint8_t sz = translate_char(ev.key.keysym.sym, buffer); 
                for (size_t i = 0; i < sz; ++i)
                    interface_uart_write(buffer[i]);
            }
        }

        // User events

        else if (ev.type == E_CHANGE_BACKGROUND + start_event) {
            loop_set_background((intptr_t) ev.user.data1);
        } else if (ev.type == E_TEXT_PRINT + start_event) {
            text_output((intptr_t) ev.user.data1);
        } else if (ev.type == E_RESET + start_event) {

        }
    }
}

void events_destroy()
{
}
