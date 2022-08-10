#include "z80.h"

#include <stdio.h>

#include <avr/io.h>
#include <avr/pgmspace.h>
#include <avr/sfr_defs.h>
#include <util/delay.h>

#include "ansi.h"
#include "config.h"

#define clear_RST()   PORTB &= ~_BV(PB4)
#define set_RST()     PORTB |= _BV(PB4)
#define clear_BUSRQ() PORTF &= ~_BV(PF4)
#define set_BUSRQ()   PORTF |= _BV(PF4)

#define get_BUSACK()  (PINE & _BV(PINE3))

void z80_init(void)
{
    clear_RST();
    set_BUSRQ();
    DDRB |= _BV(DDB4);
    DDRF |= _BV(DDF4);
#if DEBUG_Z80 >= 1
    printf_P(PSTR(CYN "[Z80 initialized] " RST));
#endif
}

void z80_start(void)
{
    clear_RST();
    _delay_ms(50);
    set_RST();
#if DEBUG_Z80 >= 1
    printf_P(PSTR(CYN "[Z80 has started and taken over the bus] " RST));
#endif
}

void z80_release_bus(void)
{
    clear_BUSRQ();
    loop_until_bit_is_clear(PINE, PINE3);
#if DEBUG_Z80 >= 1
    printf_P(PSTR(CYN "[Z80 has released the bus] " RST));
#endif
}

void z80_continue_execution(void)
{
    set_BUSRQ();
    loop_until_bit_is_set(PINE, PINE3);
#if DEBUG_Z80 >= 1
    printf_P(PSTR(CYN "[Z80 has taken over the bus] " RST));
#endif
}

// vim:ts=4:sts=4:sw=4:expandtab
