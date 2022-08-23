#include "io/io.h"

#include <stdio.h>

#include "dev/rtc.h"
#include "dev/uart.h"
#include "io/ops.h"
#include "io/ioregs.h"
#include "io/serial.h"

static IO_Regs ioregs;

bool io_write(uint8_t addr, uint8_t data)
{
    if (addr <= 0xb) {
        ((uint8_t*) &ioregs)[addr] = data;
        return false;
    }

    switch (addr) {

        // serial

        case S_PUT:
            putchar(data);
            break;

        // rtc

        case RTC_SET: 
            rtc_set((ClockDateTime) {
                .yy = ioregs.Pa0,
                .mm = ioregs.Pa1,
                .dd = ioregs.Pb0,
                .hh = ioregs.Pb1,
                .nn = ioregs.Qa0,
                .ss = ioregs.Qa1,
            });
            break;

        // operations that require the control of the bus
        case S_PRINT_Z:
        case S_PRINT_LEN:
            return true;
    }

    return false;
}

void io_write_bus(uint8_t addr, uint8_t data)
{
    switch (addr) {

        // serial
        
        case S_PRINT_Z:
            io_serial_print_z(&ioregs);
            break;

        case S_PRINT_LEN:
            io_serial_print_len(&ioregs);
            break;
    }
}

uint8_t io_read(uint8_t addr)
{
    if (addr <= 0xb) {
        return ((uint8_t*) &ioregs)[addr];
    }

    switch (addr) {
        
        // serial

        case S_GET:         return uart_getchar_nonblocking();
        case S_GET_BLK:     return getchar();

        // RTC

        case RTC_GET_YEAR:    return rtc_get().yy;
        case RTC_GET_MONTH:   return rtc_get().mm;
        case RTC_GET_DAY:     return rtc_get().dd;
        case RTC_GET_HOUR:    return rtc_get().hh;
        case RTC_GET_MINUTES: return rtc_get().nn;
        case RTC_GET_SECONDS: return rtc_get().ss;
    }
    
    return 0;
}

// vim:ts=4:sts=4:sw=4:expandtab
