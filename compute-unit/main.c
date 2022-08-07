#include <stdio.h>

#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <util/delay.h>

#include "rtc.h"
#include "debug.h"
#include "event.h"
#include "lcd.h"
#include "monitor.h"
#include "sdcard.h"
#include "spi.h"
#include "uart.h"
#include "usr.h"

volatile Event last_event = EV_NONE;

int main(void)
{
    _delay_ms(200);

    uart_init();
    puts_P(PSTR("\e[1;1H\e[2JWelcome to Fortuna-3!\n"));
    debug_reset_reason();

    usr_init();
    lcd_init();
    rtc_init();
    spi_init();
    sdcard_init();

    if (sdcard_setup())
        puts_P(PSTR("SDCard initialized."));
    else
        puts_P(PSTR(RED "Error initializing SDCard." RST));
    putchar('\n');

    sei();

#ifdef MONITOR
    monitor();  // TODO - move to USR1 event
#endif

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
