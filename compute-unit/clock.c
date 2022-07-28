#include "clock.h"

#include <avr/io.h>
#include <util/delay.h>

#define set_SCLK()   PORTD |= _BV(PD2)
#define clear_SCLK() PORTD &= ~_BV(PD2)
#define set_CE()     PORTD |= _BV(PD3)
#define clear_CE()   PORTD &= ~_BV(PD3)
#define set_IO()     PORTD |= _BV(PD7)
#define clear_IO()   PORTD &= ~_BV(PD7)
#define get_IO()     (PIND & _BV(PIND7))

void clock_init(void)
{
    DDRD |= _BV(PD2) | _BV(PD3) | _BV(PD7);
}

static uint8_t clock_cmd_get(uint8_t cmd)
{
    set_CE();
    _delay_us(4);

    for (int i = 0; i < 8; ++i) {  // write command
        if ((cmd >> i) & 1)
            set_IO();
        else
            clear_IO();
        _delay_us(1);
        set_SCLK();
        _delay_us(1);
        clear_SCLK();
        _delay_us(1);
    }

    clear_IO();                    // change to read mode
    _delay_us(1);
    DDRD &= ~_BV(PD7);

    uint8_t data = 0;              // read command
    for (int i = 0; i < 8; ++i) {
        if (get_IO())
            data |= (1 << i);
        set_SCLK();
        _delay_us(1);
        clear_SCLK();
        _delay_us(1);
    }

    clear_CE();                    // change back to write mode
    _delay_us(4);

    DDRD |= _BV(PD7);

    return data;
}

static void clock_cmd_set(uint8_t cmd, uint8_t data)
{
    set_CE();
    _delay_us(4);

    uint16_t value = cmd | (((uint16_t) data) << 8);

    for (int i = 0; i < 16; ++i) {  // write command
        if ((value >> i) & 1)
            set_IO();
        else
            clear_IO();
        _delay_us(1);
        set_SCLK();
        _delay_us(1);
        clear_SCLK();
        _delay_us(1);
    }

    clear_CE();
    _delay_us(4);
}

ClockDateTime clock_get(void)
{
    uint8_t ss = clock_cmd_get(0x81);
    uint8_t nn = clock_cmd_get(0x83);
    uint8_t hh = clock_cmd_get(0x85);
    uint8_t dd = clock_cmd_get(0x87);
    uint8_t mm = clock_cmd_get(0x89);
    uint8_t yy = clock_cmd_get(0x8d);
    return (ClockDateTime) {
        .ss = (((ss >> 4) & 0b111) * 10) + (ss & 0xf),
        .nn = (nn >> 4) * 10 + (nn & 0xf),
        .hh = (((hh >> 4) & 0b11) * 10) + (hh & 0xf),
        .dd = (((dd >> 4) & 0b11) * 10) + (dd & 0xf),
        .mm = (((mm >> 4) & 0b1) * 10) + (mm & 0xf),
        .yy = ((yy >> 4) * 10) + (yy & 0xf),
    };
}

void clock_set(ClockDateTime dt)
{
    clock_cmd_set(0x80, ((dt.ss / 10) << 4) | (dt.ss % 10));
    clock_cmd_set(0x82, ((dt.nn / 10) << 4) | (dt.nn % 10));
    clock_cmd_set(0x84, ((dt.hh / 10) << 4) | (dt.hh % 10));
    clock_cmd_set(0x86, ((dt.dd / 10) << 4) | (dt.dd % 10));
    clock_cmd_set(0x88, ((dt.mm / 10) << 4) | (dt.mm % 10));
    clock_cmd_set(0x8c, ((dt.yy / 10) << 4) | (dt.yy % 10));
}

// vim:ts=4:sts=4:sw=4:expandtab
