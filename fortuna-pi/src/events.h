#ifndef EVENTS_H_
#define EVENTS_H_

#include <stdbool.h>
#include <stdint.h>

typedef enum {
    E_CHANGE_BACKGROUND,
    EV_TEXT_OUTPUT,
    EVENT_COUNT
} EventType;

void events_init();
void events_push(EventType event_type, void* data, bool need_to_be_freed);
void events_destroy();

#endif