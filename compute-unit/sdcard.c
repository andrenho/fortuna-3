#include "sdcard.h"

#include <avr/pgmspace.h>
#include <util/delay.h>

#include "spi.h"

#define set_CE()   PORTG |= _BV(PG5)
#define clear_CE() PORTG &= ~_BV(PG5)

void sdcard_init(void)
{
    DDRG = _BV(PORTG5);
}

void sdcard_setup(void)
{
    // powerup card
    clear_CE();
    _delay_ms(1);
    for (uint8_t i = 0; i < 10; ++i)
        spi_send(0xff);

    // deselect card
    clear_CE();
    spi_send(0xff);
}

static void command(uint8_t cmd, uint32_t args, uint8_t crc)
{
    spi_send(cmd | 0x40);
    spi_send((uint8_t)(args >> 24));
    spi_send((uint8_t)(args >> 16));
    spi_send((uint8_t)(args >> 8));
    spi_send((uint8_t)args);
    spi_send(crc | 0x1);
}

// vim:ts=4:sts=4:sw=4:expandtab
