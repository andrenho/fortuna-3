#ifndef WINDOW_H
#define WINDOW_H

#include <stdbool.h>
#include "global.h"

void window_init();
bool window_loop_step();
void window_destroy();

#endif
