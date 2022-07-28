#include "spi.h"

#include <avr/pgmspace.h>
#include <avr/io.h>
#include <util/delay.h>

#include "debug.h"

void spi_init(void)
{
    DDRB |= (1 << DDB1) | (1 << DDB2);   // MOSI, SCK: output
    DDRB &= ~(1 << DDB3);  // MISO: input
    
    // enable SPI, set as MASTER, clock to fosc/128 (TODO - can it go faster?)
    SPCR = (1 << SPE) | (1 << MSTR) | (1 << SPR1) | (1 << SPR0);
}

uint8_t spi_send(uint8_t byte)
{
    SPDR = byte;
    while (!(SPSR & (1 << SPIF)));
    uint8_t r = SPDR;
    debug_spi_send(byte, r);
    return r;
}

uint8_t spi_recv(void)
{
    return spi_send(0xff);
}

uint8_t spi_recv_ignore_ff(void)
{
    uint8_t i = 0, r;
    while ((r = spi_recv()) == 0xff) {
        ++i;
        _delay_us(30);
        if (i > 8)
            break;  // timeout
    }
    return r;
}

// vim:ts=4:sts=4:sw=4:expandtab
