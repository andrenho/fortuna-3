#include "sdcard.h"

#include <avr/pgmspace.h>
#include <util/delay.h>
#include <stdio.h>

#include "debug.h"
#include "spi.h"

#define set_CE()   { PORTG |= _BV(PG5); debug_spi_inactive(PSTR("SD")); }
#define clear_CE() { PORTG &= ~_BV(PG5); debug_spi_active(PSTR("SD")); }

static void command(uint8_t cmd, uint32_t args, uint8_t crc)
{
    spi_send(cmd | 0x40);
    spi_send((uint8_t)(args >> 24));
    spi_send((uint8_t)(args >> 16));
    spi_send((uint8_t)(args >> 8));
    spi_send((uint8_t)args);
    spi_send(crc | 0x1);
}

void sdcard_init(void)
{
    DDRG = _BV(DDG5);
}

static void sdcard_poweron(void)
{
    // powerup card
    set_CE();
    _delay_ms(1);
    for (uint8_t i = 0; i < 10; ++i)
        spi_send(0xff);

    // deselect card
    set_CE();
    spi_send(0xff);

#ifdef DEBUG_SDCARD
    puts_P(PSTR("\n[SDCard powered on] "));
#endif
}

static bool sdcard_software_reset(void)
{
    clear_CE();
    command(0, 0, 0x94);
    uint8_t r1 = spi_recv_ignore_ff();
    set_CE();

#ifdef DEBUG_SDCARD
    printf_P(PSTR("\n[SDCard software reset: 0x%x] "), r1);
#endif

    return r1 == 0x1;
}

static bool sdcard_initialize(void)
{
    clear_CE();
    command(55, 0, 0);
    uint8_t r1 = spi_recv_ignore_ff();
    set_CE();
    if (r1 > 1) {
#ifdef DEBUG_SDCARD
        puts_P(PSTR("\n[Command CMD55 not supported by SDCard.]\n"));
#endif
        return false;
    }

    clear_CE();
    command(0x41, 0x40000000, 0);
    for (int i = 0; i < 16; ++i) {
        r1 = spi_recv_ignore_ff();
        if (r1 == 1)
            break;
        _delay_ms(50);
    }
    set_CE();
    if (r1 != 1) {
#ifdef DEBUG_SDCARD
        puts_P(PSTR("\n[Error initializing SDCard (ACMD41).]\n"));
#endif
        return false;
    }

#ifdef DEBUG_SDCARD
        puts_P(PSTR("\n[SDCard initialized.]\n"));
#endif

    return true;
}

bool sdcard_setup(void)
{
    sdcard_poweron();
    if (!sdcard_software_reset()) return false;
    if (!sdcard_initialize()) return false;

    return true;
}

bool sdcard_read_block(uint32_t block, uint8_t* data)
{

}

// vim:ts=4:sts=4:sw=4:expandtab
