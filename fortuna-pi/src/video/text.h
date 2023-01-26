#ifndef TEXT_H_
#define TEXT_H_

#include "window.h"

#define TEXT_CHAR_W 6
#define TEXT_CHAR_H 9
#define TEXT_BORDER_X 5
#define TEXT_BORDER_Y 6
#define TEXT_BLINK_DELAY 600

void text_init();
void text_reset();
void text_output(uint8_t c);
void text_update();
void text_draw();
void text_destroy();

#endif
