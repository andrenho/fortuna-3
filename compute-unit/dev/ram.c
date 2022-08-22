#include "ram.h"

#include <avr/io.h>
#include <avr/cpufunc.h>

#define clear_OE() PORTF &= ~_BV(PF5)
#define set_OE()   PORTF |= _BV(PF5)
#define clear_WE() PORTF &= ~_BV(PF6)
#define set_WE()   PORTF |= _BV(PF6)
#define clear_CE() PORTF &= ~_BV(PF7)
#define set_CE()   PORTF |= _BV(PF7)

static uint8_t bank = 0;

void release_bus(void)
{
    DDRC = DDRA = DDRL = 0;                        // address, data
    DDRF &= ~(_BV(DDF5) | _BV(DDF6) | _BV(DDF7));  // control bus
    PORTC = PORTA = PORTL = 0;
}

void take_bus(void)
{
    DDRC = DDRA = 0xff;                            // address
    DDRF |= _BV(DDF5) | _BV(DDF6) | _BV(DDF7);     // control bus (all pins high)
    PORTF |= _BV(PF5) | _BV(PF6) | _BV(PF7);
}

void ram_init(void)
{
    DDRB |= _BV(DDB5) | _BV(DDB6) | _BV(DDB7);     // A16 ~ A18
    release_bus();
}

uint8_t ram_bank(void)
{
    return bank;
}

void ram_set_bank(uint8_t new_bank)
{
    PORTB &= ~(0b111 << 5);
    PORTB |= (new_bank << 5);
    bank = new_bank;
}

uint8_t ram_get_byte(uint16_t addr)
{
    take_bus();
    DDRL = 0x0;   // data bus: read
    PORTA = (addr & 0xff);
    PORTC = (addr >> 8);
    clear_CE();
    clear_OE();
    _NOP();
    uint8_t data = PINL;
    set_OE();
    set_CE();
    release_bus();
    return data;
}

void ram_set_byte(uint16_t addr, uint8_t data)
{
    take_bus();
    DDRL = 0xff;   // data bus: write
    PORTA = (addr & 0xff);
    PORTC = (addr >> 8);
    PORTL = data;
    clear_CE();
    clear_WE();
    _NOP();
    set_WE();
    set_CE();
    release_bus();
}

void ram_read_block(uint16_t block, uint8_t* bytes)
{
    take_bus();
    DDRL = 0x0;   // data bus: read
    clear_CE();
    clear_OE();
    for (uint16_t i = 0; i < 256; ++i) {
        uint16_t addr = (block * 0x100) + i;
        PORTA = (addr & 0xff);
        PORTC = (addr >> 8);
        _NOP();
        bytes[i] = PINL;
    }
    set_OE();
    set_CE();
    release_bus();
}

void ram_write_block(uint16_t block, uint8_t* bytes)
{
    take_bus();
    DDRL = 0xff;   // data bus: write
    clear_CE();
    for (uint16_t i = 0; i < 256; ++i) {
        uint16_t addr = (block * 0x100) + i;
        PORTA = (addr & 0xff);
        PORTC = (addr >> 8);
        PORTL = bytes[i];
        clear_WE();
        _NOP();
        set_WE();
    }
    set_CE();
    release_bus();
}

// vim:ts=4:sts=4:sw=4:expandtab