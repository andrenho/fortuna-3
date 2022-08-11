#include "z80.h"

#include <stdio.h>

#include <avr/io.h>
#include <avr/pgmspace.h>
#include <avr/sfr_defs.h>
#include <util/delay.h>

#include "ansi.h"
#include "config.h"

#define clear_RST()    PORTB &= ~_BV(PB4)
#define set_RST()      PORTB |= _BV(PB4)
#define clear_BUSRQ()  PORTF &= ~_BV(PF4)
#define set_BUSRQ()    PORTF |= _BV(PF4)
#define clear_IOCONT() PORTF &= ~_BV(PF3)
#define set_IOCONT()   PORTF |= _BV(PF3)

#define get_BUSACK()  (PINE & _BV(PINE3))
#define get_WR()      (PINF & _BV(PINF5))
#define get_RD()      (PINF & _BV(PINF6))

static void reset_wait(void)
{
    set_IOCONT();
    clear_IOCONT();
    set_IOCONT();
}

void z80_init(void)
{
    EICRB |= _BV(ISC41);  // fire interrupt INT4 (IORQ) on falling edge
    EIMSK |= _BV(INT4);   // enable interrupt INT4

    clear_RST();
    set_BUSRQ();
    DDRB |= _BV(DDB4);
    DDRF |= _BV(DDF3) | _BV(DDF4);
    reset_wait();
#if DEBUG_Z80 >= 1
    printf_P(PSTR(CYN "[Z80 initialized] " RST));
#endif
}

void z80_reset(void)
{
    clear_RST();
    _delay_ms(50);
    set_RST();
#if DEBUG_Z80 >= 1
    printf_P(PSTR(CYN "[Z80 has been reset and taken over the bus] " RST));
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

void z80_iorq(void)
{
    uint16_t addr = PINA | (PINC << 8);
    if (get_WR() == 0) {
        uint16_t data = PINL;
#if DEBUG_Z80 >= 1
        printf_P(PSTR(CYN "[Z80 has made an I/O request (output: addr 0x%04X, data 0x%02X)] " RST), addr, data);
#endif

    } else if (get_RD() == 0) {
#if DEBUG_Z80 >= 1
        printf_P(PSTR(CYN "[Z80 has made an I/O request (input: addr 0x%04X)] " RST), addr);
#endif

    } else {
#if DEBUG_Z80 >= 1
        printf_P(PSTR(RED "[Z80 has made an I/O request, but is neither an input nor an output] " RST));
#endif
    }
    
    getchar();

    // continue execution
    clear_IOCONT();
    loop_until_bit_is_set(PINE, PINE4);  // wait until IORQ is 1
    set_IOCONT();
}

// vim:ts=4:sts=4:sw=4:expandtab
