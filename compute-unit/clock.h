#ifndef CLOCK_H_
#define CLOCK_H_

#include <stdint.h>

typedef struct {
    uint8_t ss, nn, hh, dd, mm, yy;
} ClockDateTime;

void          clock_init(void);

ClockDateTime clock_get(void);
void          clock_set(ClockDateTime dt);

#endif

// vim:ts=4:sts=4:sw=4:expandtab
