#ifndef TEXT_H_
#define TEXT_H_

#include "window.h"

#define TEXT_CHAR_W  6
#define TEXT_CHAR_H  9
#define TEXT_BORDER  5
#define TEXT_COLUMNS ((SCREEN_W * 2 - TEXT_BORDER * 2) / TEXT_CHAR_W)
#define TEXT_LINES   ((SCREEN_H * 2 - TEXT_BORDER * 2) / TEXT_CHAR_H)

void text_init();
void text_update();
void text_draw();
void text_destroy();

#endif