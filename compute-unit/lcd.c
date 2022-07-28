#include "lcd.h"

#include <stdint.h>

#include <avr/io.h>
#include <util/delay.h>

#define set_E()    PORTK |= _BV(PK0)
#define clear_E()  PORTK &= ~_BV(PK0)
#define set_RS()   PORTK |= _BV(PK1)
#define clear_RS() PORTK &= ~_BV(PK1)
#define set_DATA(value) PORTK = (PORTK & 0b11) | ((value) << 2)


#define E  PORTK0
#define RS PORTK1
#define TO_D(v) (((v) & 0xf) << 2)

/*
static void lcd_command(uint8_t cmd)
{
    // send upper nibble
    PORTK = TO_D(cmd >> 4) | _BV(E);   // send nibble, RS=0
    _delay_us(1);
    PORTK &= ~_BV(E);                  // pulse
    _delay_us(200);

    // send lower nibble
    PORTK = TO_D(cmd) | _BV(E);        // send nibble, RS=0
    _delay_us(1);
    PORTK &= ~_BV(E);                  // pulse
    _delay_us(200);
}
*/

static void send_command(int rs, uint8_t data)
{
	if (rs) set_RS(); else clear_RS();
    set_DATA(data);
    set_E();
    _delay_ms(2);
    clear_E();
}

void lcd_init(void)
{
    DDRK = 0b111111;

	clear_RS();
    clear_E();
    set_DATA(0);

    send_command(0, 0b0010);   // set to 4-bit operation
    send_command(0, 0b0010);   // function set: 4 bits, 2 lines, 5x11 font
    send_command(0, 0b1000);
    send_command(0, 0b0000);   // display/cursor on
    send_command(0, 0b1110); 

    send_command(0, 0b0000);   // entry mode
    send_command(0, 0b0110); 

    send_command(0, 0b0000);   // clear screen
    send_command(0, 0b0001); 

    send_command(1, 0b0100);   // print 'H'
    send_command(1, 0b1000); 

    send_command(1, 0b0110);   // print 'a'
    send_command(1, 0b0001); 

    /*
    lcd_command(0x33);
    lcd_command(0x32);   // 4-bit initialization
    lcd_command(0x28);   // 2 line, 5*7 matrix in 4-bit mode
    lcd_command(0x0c);   // cursor off
    lcd_command(0x06);   // increment cursor
    lcd_clear();
    */
}

void lcd_clear(void)
{
    /*
    lcd_command(0x01);   // clear screen
    _delay_ms(2);
    lcd_command(0x80);   // cursor at home
    */
}

void lcd_print_char(uint8_t c)
{
    /*
    // send upper nibble
    PORTK = TO_D(c >> 4) | _BV(RS) | _BV(E);   // send nibble, RS=0
    _delay_us(1);
    PORTK &= ~_BV(E);                // pulse
    _delay_us(200);

    // send lower nibble
    PORTK = TO_D(c) | _BV(E);        // send nibble, RS=0
    _delay_us(1);
    PORTK &= ~_BV(E);                // pulse
    _delay_ms(2);
    */
}

// vim:ts=4:sts=4:sw=4:expandtab
