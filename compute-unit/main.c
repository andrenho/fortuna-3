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

extern char _binary_bios_bin_start;
extern int _binary_bios_bin_size;

typedef struct {
    bool monitor : 1;
    bool usr     : 1;
    bool iorq    : 1;
    bool remote  : 1;
} Events;

volatile Events events = { false, false, false, false };

static void setup_interrupts(void)
{
    EICRA |= _BV(ISC21) | _BV(ISC31);  // fire interrupt INT2 and INT3 on falling edge
    EICRB |= _BV(ISC41);  // fire interrupt INT4 (IORQ) on falling edge
    EIMSK |= _BV(INT2) | _BV(INT3);    // enable interrupts INT2 and INT3
    UCSR0B |= (1<<RXEN0); // enable interrupt for UART
}

static void load_bios(void)
{
    for (int i = 0; i < _binary_bios_bin_size; ++i)
        ram_set_byte(i, (&_binary_bios_bin_start)[i]);
}

int main(void)
{
    initialize();
    setup_interrupts();
    load_bios();

    puts_P(PSTR("\nWelcome to Fortuna-3!\n"));

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
    if (latest_char == 0xfe && udr == 0xf0) {
        events.remote = true;
    }
    latest_char = udr;
}

// vim:ts=4:sts=4:sw=4:expandtab
