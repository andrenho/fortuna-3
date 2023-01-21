#ifndef WINDOW_H
#define WINDOW_H

#include <stdbool.h>
#include "global.h"

void window_init();
void window_main_loop();
void window_main_loop_emscripten();
bool window_single_loop();
void window_destroy();

#endif
