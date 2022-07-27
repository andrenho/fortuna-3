#include <stdio.h>

#include <avr/interrupt.h>
#include <avr/pgmspace.h>

#include "event.h"
#include "uart.h"
#include "usr.h"

volatile Event last_event = EV_NONE;

int main(void)
{
    uart_init();
    usr_setup();
    puts_P(PSTR("Hello world!"));

    sei();

    while (1) {
        switch (last_event) {

            case EV_NONE:
                break;

            case EV_USR0:
                cli();
                puts_P(PSTR("USR0"));
                last_event = EV_NONE;
                sei();
                break;

            case EV_USR1:
                cli();
                puts_P(PSTR("USR1"));
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

// vim:ts=4:sts=4:sw=4:expandtab
