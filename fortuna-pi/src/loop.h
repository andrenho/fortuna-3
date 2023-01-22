#ifndef LOOP_H_
#define LOOP_H_

#include <stdint.h>

void loop_init();
void loop();
void loop_set_background(uint8_t bg);
void loop_destroy();

#endif