#include "usr.h"

#include <avr/io.h>

void usr_init(void)
{
    EICRA |= _BV(ISC21) | _BV(ISC31);  // fire interrupt INT2 and INT3 on falling edge
    EIMSK |= _BV(INT2) | _BV(INT3);    // enable interrupts INT2 and INT3
}

// vim:ts=4:sts=4:sw=4:expandtab
