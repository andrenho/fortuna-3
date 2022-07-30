#include <stdio.h>

#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <util/delay.h>

#include "clock.h"
#include "debug.h"
#include "event.h"
#include "lcd.h"
#include "sdcard.h"
#include "spi.h"
#include "uart.h"
#include "usr.h"

volatile Event last_event = EV_NONE;

int main(void)
{
    _delay_ms(100);

    uart_init();
    debug_reset_reason();

    usr_init();
    lcd_init();
    clock_init();
    spi_init();
    sdcard_init();

    /*
    ClockDateTime dtx = {
        .dd = 28, .mm = 7, .yy = 22,
        .ss = 0, .nn = 38, .hh = 14,
    };
    clock_set(dtx);
    */

    char buf[25];
    ClockDateTime dt = clock_get();
    snprintf(buf, sizeof buf, "%04d/%02d/%02d %02d:%02d:%02d\n", (2000 + dt.yy), dt.mm, dt.dd, dt.hh, dt.nn, dt.ss);
    lcd_print(buf);
    puts(buf);

    bool sdcard_ok = sdcard_setup();
    if (!sdcard_ok)
        puts_P(PSTR("SDCard initialization failed."));
    puts_P(PSTR("SDCard initialized."));

    uint8_t buffer[512];
    sdcard_read_block(0, buffer);

    sei();

    while (1) {
        switch (last_event) {

            case EV_NONE:
                break;

            case EV_USR0:
                cli();
                usr0_on_press();
                last_event = EV_NONE;
                _delay_ms(80);
                sei();
                break;

            case EV_USR1:
                cli();
                usr1_on_press();
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
