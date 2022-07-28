#include <stdio.h>

#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <util/delay.h>

#include "event.h"
#include "lcd.h"
#include "uart.h"
#include "usr.h"

volatile Event last_event = EV_NONE;

int main(void)
{
    _delay_ms(100);

    uart_init();
    usr_init();
    lcd_init();
    puts_P(PSTR("Hello world!"));

    lcd_print_char('H');
    lcd_print_char('e');
    lcd_print_char('l');
    lcd_print_char('l');
    lcd_print_char('o');
    lcd_print_char('!');

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
