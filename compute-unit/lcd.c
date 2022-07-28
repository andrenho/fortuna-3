#include "lcd.h"

#include <stdint.h>

#include <avr/io.h>
#include <util/delay.h>

#define set_E()    PORTK |= _BV(PK0)
#define clear_E()  PORTK &= ~_BV(PK0)
#define set_RS()   PORTK |= _BV(PK1)
#define clear_RS() PORTK &= ~_BV(PK1)
#define set_DATA(value) PORTK = (PORTK & 0b11) | (((value & 0xf)) << 2)

void lcd_init(void)
{
    DDRK = 0b111111;

	clear_RS();
    clear_E();
    set_DATA(0);

    lcd_command(0, 0b0010);   // set to 4-bit operation
    lcd_command(0, 0b0010);   // function set: 4 bits, 2 lines, 5x11 font
    lcd_command(0, 0b1000);
    lcd_command(0, 0b0000);   // display/cursor on
    lcd_command(0, 0b1100); 

    lcd_command(0, 0b0000);   // entry mode
    lcd_command(0, 0b0110); 

    lcd_clear();
}

void lcd_clear(void)
{
    lcd_command(0, 0b0000);
    lcd_command(0, 0b0001); 
}

void lcd_print_char(uint8_t c)
{
    lcd_command(1, c >> 4);
    lcd_command(1, c & 0xf);
}

void lcd_print(char* str)
{
    while (*str)
        lcd_print_char(*str++);
}

void lcd_command(bool rs, uint8_t data)
{
	if (rs) set_RS(); else clear_RS();
    set_DATA(data);
    set_E();
    _delay_ms(2);
    clear_E();
}

// vim:ts=4:sts=4:sw=4:expandtab
