#include <stdio.h>

#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <util/delay.h>

#include "config.h"
#include "debug.h"
#include "event.h"
#include "fs.h"
#include "lcd.h"
#include "monitor.h"
#include "ram.h"
#include "rtc.h"
#include "sdcard.h"
#include "spi.h"
#include "uart.h"
#include "usr.h"

#include "fsfat/ff.h"

volatile Event last_event = EV_NONE;

static void initialize(void)
{
    _delay_ms(200);

    uart_init();

#if DEBUG_RESET_REASON
    debug_reset_reason();
#endif

    usr_init();
    lcd_init();
    rtc_init();
    spi_init();
    ram_init();
    sdcard_init();

    if (!sdcard_setup()) {
        puts_P(PSTR(RED "Error initializing SDCard." RST));
        for (;;);
    }

    if (!fs_mount()) {
        puts_P(PSTR(RED "Error mounting partition." RST));
        for (;;);
    }
    putchar('\n');

    puts_P(PSTR("\e[1;1H\e[2JWelcome to Fortuna-3!\n"));
}

int main(void)
{
    initialize();

    sei();

#if INCLUDE_MONITOR && RUN_MONITOR_AT_START
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

// vim:ts=4:sts=4:sw=4:expandtab
