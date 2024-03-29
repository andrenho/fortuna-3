#include "rtc.h"

#include <stdio.h>

#include <avr/io.h>
#include <avr/pgmspace.h>
#include <util/delay.h>

#include "ansi.h"
#include "config.h"

#define set_SCLK()   PORTJ |= _BV(PJ0)
#define clear_SCLK() PORTJ &= ~_BV(PJ0)
#define set_CE()     PORTJ |= _BV(PJ1)
#define clear_CE()   PORTJ &= ~_BV(PJ1)
#define set_IO()     PORTD |= _BV(PD7)
#define clear_IO()   PORTD &= ~_BV(PD7)
#define get_IO()     (PIND & _BV(PIND7))

void rtc_init(void)
{
    DDRD |= _BV(DDD7);
    DDRJ |= _BV(DDJ0) | _BV(DDJ1);
}

static uint8_t rtc_cmd_get(uint8_t cmd)
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
#if DEBUG_RTC >= 2
    printf_P(PSTR(GRN "%02X "), cmd);
#endif

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
#if DEBUG_RTC >= 2
    printf_P(PSTR(RED "%02X "), data);
#endif

    clear_CE();                    // change back to write mode
    _delay_us(4);

    DDRD |= _BV(PD7);

    return data;
}

static void rtc_cmd_set(uint8_t cmd, uint8_t data)
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
#if DEBUG_RTC >= 2
    printf_P(PSTR(GRN "%04X "), value);
#endif

    clear_CE();
    _delay_us(4);
}

ClockDateTime rtc_get(void)
{
#if DEBUG_RTC >= 1
    printf_P(PSTR(CYN "[Getting RTC " RST));
#endif
    uint8_t ss = rtc_cmd_get(0x81);
    uint8_t nn = rtc_cmd_get(0x83);
    uint8_t hh = rtc_cmd_get(0x85);
    uint8_t dd = rtc_cmd_get(0x87);
    uint8_t mm = rtc_cmd_get(0x89);
    uint8_t yy = rtc_cmd_get(0x8d);
#if DEBUG_RTC >= 1
    printf_P(PSTR(CYN "] " RST));
#endif
    return (ClockDateTime) {
        .ss = (((ss >> 4) & 0b111) * 10) + (ss & 0xf),
        .nn = (nn >> 4) * 10 + (nn & 0xf),
        .hh = (((hh >> 4) & 0b11) * 10) + (hh & 0xf),
        .dd = (((dd >> 4) & 0b11) * 10) + (dd & 0xf),
        .mm = (((mm >> 4) & 0b1) * 10) + (mm & 0xf),
        .yy = ((yy >> 4) * 10) + (yy & 0xf),
    };
}

void rtc_set(ClockDateTime dt)
{
#if DEBUG_RTC >= 1
    printf_P(PSTR(CYN "[Setting RTC " RST));
#endif
    rtc_cmd_set(0x80, ((dt.ss / 10) << 4) | (dt.ss % 10));
    rtc_cmd_set(0x82, ((dt.nn / 10) << 4) | (dt.nn % 10));
    rtc_cmd_set(0x84, ((dt.hh / 10) << 4) | (dt.hh % 10));
    rtc_cmd_set(0x86, ((dt.dd / 10) << 4) | (dt.dd % 10));
    rtc_cmd_set(0x88, ((dt.mm / 10) << 4) | (dt.mm % 10));
    rtc_cmd_set(0x8c, ((dt.yy / 10) << 4) | (dt.yy % 10));
#if DEBUG_RTC >= 1
    printf_P(PSTR(CYN "] " RST));
#endif
}

// vim:ts=4:sts=4:sw=4:expandtab
