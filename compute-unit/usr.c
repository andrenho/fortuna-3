#include "usr.h"

#include <stdio.h>

#include <avr/io.h>
#include <avr/pgmspace.h>

void usr_init(void)
{
    EICRA |= _BV(ISC01) | _BV(ISC11);  // fire interrupt INT0 and INT1 on falling edge
    EIMSK |= _BV(INT1) | _BV(INT0);    // enable interrupts INT0 and INT1
}

void usr0_on_press(void)
{
    puts_P(PSTR("USR0"));
}

void usr1_on_press(void)
{
    puts_P(PSTR("USR1"));
}

// vim:ts=4:sts=4:sw=4:expandtab
