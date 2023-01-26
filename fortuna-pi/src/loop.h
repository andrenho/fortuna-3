#ifndef LOOP_H_
#define LOOP_H_

#include <stdint.h>

void    loop_init();
void    loop();
uint8_t loop_background();
void    loop_set_background(uint8_t bg);
void    loop_reset();
void    loop_destroy();

#endif