#include "usr.h"

#include <avr/io.h>

void usr_setup(void)
{
    EICRA |= _BV(ISC01) | _BV(ISC11);  // fire interrupt INT0 and INT1 on falling edge
    EIMSK |= _BV(INT1) | _BV(INT0);    // enable interrupts INT0 and INT1
}

// vim:ts=4:sts=4:sw=4:expandtab
