#include <stdbool.h>
#include <stdio.h>

#include <util/delay.h>
#include <avr/interrupt.h>
#include <avr/pgmspace.h>

#include "config.h"
#include "init.h"
#include "monitor.h"
#include "ram.h"
#include "remote.h"
#include "uart.h"
#include "z80.h"

typedef struct {
    bool monitor : 1;
    bool usr     : 1;
    bool iorq    : 1;
    bool remote  : 1;
} Events;

volatile Events events = { false, false, false, false };

int main(void)
{
    initialize();
    puts_P(PSTR("Welcome to Fortuna-3!\n"));

    z80_reset();

#if INCLUDE_MONITOR && RUN_MONITOR_AT_START
    cli();
    monitor();
#endif

    sei();

    while (1) {
        if (events.monitor) {
            cli();
            events.monitor = false;
#if INCLUDE_MONITOR
            monitor();
#endif
            _delay_ms(80);
            sei();
        }

        if (events.usr) {
            // TODO
        }

        if (events.iorq) {
            cli();
            z80_iorq();
            events.iorq = false;
            sei();
        }

        if (events.remote) {
            cli();
            remote();
            z80_reset();
            events.remote = false;
            sei();
        }
    }

    return 0;
}

ISR(BADISR_vect)
{
    uart_badisr();
}

ISR(INT2_vect)
{
    events.monitor = true;
}

ISR(INT3_vect)
{
    events.usr = true;
}

ISR(INT4_vect)
{
    events.iorq = true;
}

static uint8_t latest_char = 0;
ISR(USART0_RX_vect)
{
    uint8_t udr = UDR0;
    if (latest_char == 0xfe && udr == 0xf0)
        events.remote = true;
    latest_char = udr;
}

// vim:ts=4:sts=4:sw=4:expandtab
