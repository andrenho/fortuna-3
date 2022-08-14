#include <stdio.h>

#include <util/delay.h>
#include <avr/interrupt.h>
#include <avr/pgmspace.h>

#include "config.h"
#include "init.h"
#include "monitor.h"
#include "ram.h"
#include "uart.h"
#include "z80.h"

typedef enum {
    EV_NONE, EV_USR0, EV_USR1, EV_IORQ,
} Event;
volatile Event last_event = EV_NONE;

int main(void)
{
    initialize();
    puts_P(PSTR("Welcome to Fortuna-3!\n"));

    sei();

#if INCLUDE_MONITOR && RUN_MONITOR_AT_START
    z80_reset();
    monitor();
#endif

    while (1) {
        switch (last_event) {

            case EV_NONE:
                break;

            case EV_USR0:
                cli();
                // TODO - do something?
                last_event = EV_NONE;
                _delay_ms(80);
                sei();
                break;

            case EV_USR1:
                cli();
#if INCLUDE_MONITOR
                monitor();
#endif
                last_event = EV_NONE;
                _delay_ms(80);
                sei();
                break;

            case EV_IORQ:
                cli();
                z80_iorq();
                last_event = EV_NONE;
                sei();
                break;
        }

    }

    return 0;
}

ISR(BADISR_vect)
{
    uart_badisr();
}

ISR(INT0_vect)
{
    last_event = EV_USR0;
}

ISR(INT1_vect)
{
    last_event = EV_USR1;
}

ISR(INT4_vect)
{
    last_event = EV_IORQ;
}

// vim:ts=4:sts=4:sw=4:expandtab
