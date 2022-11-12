#include "dev/rtc.h"

void rtc_init(void)
{
}

ClockDateTime rtc_get(void)
{
    return (ClockDateTime) {
        .ss = 0,
        .nn = 0,
        .hh = 0,
        .dd = 0,
        .mm = 0,
        .yy = 0
    };
}

void rtc_set(ClockDateTime dt)
{
}