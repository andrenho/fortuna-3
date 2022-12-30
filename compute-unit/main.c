#include <stdbool.h>
#include <stdio.h>

#include <util/delay.h>
#include <avr/interrupt.h>
#include <avr/pgmspace.h>

#include "config.h"
#include "init.h"
#include "dev/lcd.h"
#include "dev/ram.h"
#include "dev/uart.h"
#include "dev/z80.h"
#include "interface/monitor.h"
#include "interface/remote.h"

extern uint8_t _binary_bios_bin_start[];
extern uint8_t _binary_bios_bin_end[];

typedef struct {
    bool monitor : 1;
    bool usr     : 1;
    bool iorq    : 1;
} Events;

volatile Events events = { false, false, false, false };

static void setup_interrupts(void)
{
    EICRA |= _BV(ISC21) | _BV(ISC31);  // fire interrupt INT2 and INT3 on falling edge
    EICRB |= _BV(ISC41);               // fire interrupt INT4 (IORQ) on falling edge
    EIMSK |= _BV(INT2) | _BV(INT3);    // enable interrupts INT2 and INT3
}

static void load_bios(void)
{
    ram_set_byte(0x0, 0xc3);  // jp 0xf800
    ram_set_byte(0x1, 0x00);
    ram_set_byte(0x2, 0xf8);

    uint16_t i = 0xF800;
    for (uint8_t* p = _binary_bios_bin_start; p != _binary_bios_bin_end; ++p)
        ram_set_byte(i++, *p);
}

int main(void)
{
    initialize();
    cli();
    setup_interrupts();
    sei();

    puts_P(PSTR("\nWelcome to Fortuna-3!\n"));

    load_bios();

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

        if (uart_entered_remote()) {
            cli();
            remote();
            z80_reset();
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

// vim:ts=4:sts=4:sw=4:expandtab
