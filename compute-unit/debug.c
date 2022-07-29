#include "debug.h"

#include <stdio.h>

#include <avr/io.h>
#include <avr/pgmspace.h>

typedef enum { FROM_MCU, TO_MCU } Direction;

static void print_P(PGM_P p) {
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

void debug_reset_reason(void)
{
#ifdef DEBUG_RESET
    puts_P(PSTR(""));
    for (int i = 0; i < 30; ++i)
        putchar('-');
    puts_P(PSTR(""));

    print_P(PSTR("Reset reason: "));
    if (MCUSR & _BV(JTRF))
        print_P(PSTR("JTAG "));
    if (MCUSR & _BV(WDRF))
        print_P(PSTR("watchdog "));
    if (MCUSR & _BV(BORF))
        print_P(PSTR("brown-out "));
    if (MCUSR & _BV(EXTRF))
        print_P(PSTR("external reset "));
    if (MCUSR & _BV(PORF))
        print_P(PSTR("power-on "));
    puts_P(PSTR(""));
#endif
    MCUSR = 0;
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
    puts_P(PSTR(" active]"));
#endif
}

void debug_spi_inactive(PGM_P dev)
{
#ifdef DEBUG_SPI
    print_P(PSTR("\n\e[0;35m[- "));
    print_P(dev);
    puts_P(PSTR(" inactive]"));
#endif
}

void debug_spi_send(uint8_t sent, uint8_t recvd)
{
#ifdef DEBUG_SPI
    // if (sent != 0xff)
        debug_data(FROM_MCU, 1, sent);
    // if (recvd != 0xff)
        debug_data(TO_MCU, 1, sent);
#endif
}

void printbin(uint8_t value)
{
    for (int i = 7; i >= 0; --i)
        putchar(((value >> i) & 1) ? '1' : '0');
    putchar('\n');
}

// vim:ts=4:sts=4:sw=4:expandtab
