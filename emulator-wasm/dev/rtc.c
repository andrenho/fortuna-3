#include "dev/rtc.h"

#include <stdbool.h>
#include <time.h>

static ClockDateTime clk;
static bool overwritten = false;

void rtc_init(void)
{
    time_t rawtime;
    struct tm * timeinfo;

    time (&rawtime);
    timeinfo = localtime (&rawtime);

    clk.yy = timeinfo->tm_year + 100;
    clk.mm = timeinfo->tm_mon;
    clk.dd = timeinfo->tm_mday;
    clk.hh = timeinfo->tm_hour;
    clk.nn = timeinfo->tm_min;
    clk.ss = timeinfo->tm_sec;

    overwritten = false;
}

ClockDateTime rtc_get(void)
{
    time_t rawtime;
    struct tm * timeinfo;

    if (!overwritten) {
        time (&rawtime);
        timeinfo = localtime (&rawtime);

        clk.yy = timeinfo->tm_year + 100;
        clk.mm = timeinfo->tm_mon;
        clk.dd = timeinfo->tm_mday;
        clk.hh = timeinfo->tm_hour;
        clk.nn = timeinfo->tm_min;
        clk.ss = timeinfo->tm_sec;
    }

    return clk;
}

void rtc_set(ClockDateTime dt)
{
    clk = dt;
    overwritten = true;
}