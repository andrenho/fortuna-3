#include "lcd.h"

#include <stddef.h>
#include <stdint.h>
#include <stdio.h>

#include <avr/io.h>
#include <util/delay.h>

#include "ansi.h" 
#include "config.h"

#define set_E()    PORTK |= _BV(PK0)
#define clear_E()  PORTK &= ~_BV(PK0)
#define set_RS()   PORTK |= _BV(PK1)
#define clear_RS() PORTK &= ~_BV(PK1)
#define set_DATA(value) PORTK = (PORTK & 0b11) | (((value & 0xf)) << 2)

static void lcd_send_byte(bool rs, uint8_t data)
{
	if (rs) set_RS(); else clear_RS();
    set_DATA(data);
    set_E();
    _delay_ms(2);
    clear_E();
    // debug_lcd(data);
}

static void lcd_command_half_byte(uint8_t data)
{
    lcd_send_byte(0, data);
#if DEBUG_LCD >= 2
    printf_P(PSTR(GRN "%01X "), data);
#endif
}

void lcd_init(void)
{
    DDRK = 0b111111;

#if DEBUG_LCD >= 1
    printf_P(PSTR(CYN "[Initializing LCD " RST));
#endif

	clear_RS();
    clear_E();
    set_DATA(0);

    lcd_command_half_byte(0b0011);
    _delay_ms(5);
    lcd_command_half_byte(0b0011);
    lcd_command_half_byte(0b0011);

    lcd_command_half_byte(0b0010);   // set to 4-bit operation

    lcd_command(0b00101000);   // function set: 4 bits, 2 lines, 5x11 font
    
    lcd_command(0b00001100);   // display/cursor on

    lcd_clear();

    lcd_command(0b00000110);   // entry mode

#if DEBUG_LCD >= 1
    printf_P(PSTR(CYN "] " RST));
#endif

}

void lcd_clear(void)
{
    lcd_command(0b00000001);
    _delay_ms(5);
}

void lcd_print_char(uint8_t c)
{
    lcd_send_byte(1, c >> 4);
    lcd_send_byte(1, c & 0xf);
#if DEBUG_LCD >= 2
    printf_P(PSTR(MAG "%02X " RST), c);
#endif
}

void lcd_print(const char* str)
{
    while (*str)
        lcd_print_char(*str++);
}

void lcd_command(uint8_t data)
{
    lcd_send_byte(0, data >> 4);
    lcd_send_byte(0, data & 0xf);
#if DEBUG_LCD >= 2
    printf_P(PSTR(GRN "%02X " RST), data);
#endif
}

void lcd_print_line(uint8_t line, const char* str)
{
    if (line == 0)
        lcd_command(0b10);  // move to home
    else
        lcd_command(0xa8);  // move to beginning of line 2
    for (size_t i = 0; i < 16; ++i)
        lcd_print_char(' ');
    if (line == 0)
        lcd_command(0b10);
    else
        lcd_command(0xa8);
    lcd_print(str);
}

void lcd_print_line_P(uint8_t line, PGM_P p)
{
    char buf[17] = { 0 };
    strncpy_P(buf, p, 16);
    lcd_print_line(line, buf);
}

// vim:ts=4:sts=4:sw=4:expandtab
