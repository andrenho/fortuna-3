#ifndef RTC_H_
#define RTC_H_

#include <stdint.h>

typedef struct {
    uint8_t ss, nn, hh, dd, mm, yy;
} ClockDateTime;

void          rtc_init(void);

ClockDateTime rtc_get(void);
void          rtc_set(ClockDateTime dt);

#endif

// vim:ts=4:sts=4:sw=4:expandtab
