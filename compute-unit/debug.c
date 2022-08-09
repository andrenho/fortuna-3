#include "debug.h"

#include <stdio.h>

#include <avr/io.h>
#include <avr/pgmspace.h>

void debug_reset_reason(void)
{
    printf_P(PSTR("Reset reason: "));
    if (MCUSR & _BV(JTRF))
        printf_P(PSTR("JTAG "));
    if (MCUSR & _BV(WDRF))
        printf_P(PSTR("watchdog "));
    if (MCUSR & _BV(BORF))
        printf_P(PSTR("brown-out "));
    if (MCUSR & _BV(EXTRF))
        printf_P(PSTR("external reset "));
    if (MCUSR & _BV(PORF))
        printf_P(PSTR("power-on "));
    putchar('\n');

    MCUSR = 0;
}

/*
typedef enum { FROM_MCU, TO_MCU } Direction;

void print_P(PGM_P p) {
    char c;
    while ((c = pgm_read_byte(p++)))
        putchar(c);
}

static char to_hex(uint8_t nibble) {
    if (nibble <= 9)
        return nibble + '0';
    else
        return nibble + 'A' - 10;
}

static void debug_data(Direction direction, uint8_t sz, uint32_t byte)
{
    if (direction == FROM_MCU)
        print_P(PSTR("\e[1;32m"));
    else
        print_P(PSTR("\e[0;31m"));
    for (int i = sz - 1; i >= 0; --i) {
        uint8_t b = (byte >> (8 * i));
        putchar(to_hex((b >> 4) & 0xf));
        putchar(to_hex(b & 0xf));
    }
    print_P(PSTR("\e[0m "));
}

static void debug(char app, Direction direction, uint8_t sz, uint32_t byte)
{
    print_P(PSTR("\e[0;35m"));
    putchar(app);
    putchar(':');
    debug_data(direction, sz, byte);
}

void debug_lcd(uint8_t data) {
#ifdef DEBUG_LCD
    debug('L', FROM_MCU, 1, data);
#endif
}

void debug_mcu2rtc(uint8_t data)
{
#ifdef DEBUG_RTC
    debug('R', FROM_MCU, 1, data);
#endif
}

void debug_rtc2mcu(uint8_t data)
{
#ifdef DEBUG_RTC
    debug('R', TO_MCU, 1, data);
#endif
}

void debug_spi_active(PGM_P dev)
{
#ifdef DEBUG_SPI
    print_P(PSTR("\n\e[0;35m[+ "));
    print_P(dev);
    puts_P(PSTR(" active]\e[0m"));
#endif
}

void debug_spi_inactive(PGM_P dev)
{
#ifdef DEBUG_SPI
    print_P(PSTR("\n\e[0;35m[- "));
    print_P(dev);
    puts_P(PSTR(" inactive]\e[0m"));
#endif
}

void debug_spi_send(uint8_t sent, uint8_t recvd)
{
#ifdef DEBUG_SPI
    // if (sent != 0xff)
        debug_data(FROM_MCU, 1, sent);
    // if (recvd != 0xff)
        debug_data(TO_MCU, 1, recvd);
#endif
}

void printbin(uint8_t value)
{
    for (int i = 7; i >= 0; --i)
        putchar(((value >> i) & 1) ? '1' : '0');
    putchar('\n');
}

void printhex(uint8_t value)
{
    if ((value >> 4) < 10)
        putchar((value >> 4) + '0');
    else
        putchar((value >> 4) + 'A' - 10);
    if ((value & 0xf) < 10)
        putchar((value & 0xf) + '0');
    else
        putchar((value & 0xf) + 'A' - 10);
}

void printhex16(uint16_t value)
{
    printhex(value >> 8);
    printhex(value & 0xff);
}

void printhex32(uint32_t value)
{
    printhex16(value >> 16);
    printhex16(value & 0xffff);
}

void printdec(uint8_t value, size_t digits)
{
    if (value >= 100 || digits > 2) {
        putchar((value / 100) + '0');
        value -= (value / 100) * 100;
    }
    if (value >= 10 || digits > 1) {
        putchar((value / 10) + '0');
        value -= (value / 10) * 10;
    }
    putchar(value + '0');
}
*/

// vim:ts=4:sts=4:sw=4:expandtab
