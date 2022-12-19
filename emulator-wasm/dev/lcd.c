#include "dev/lcd.h"

#include <string.h>
#include <stdint.h>
#include <stdio.h>

char lcd_text_[32];
uint8_t cursor = 0;

void lcd_init(void)
{
    lcd_clear();
}

void lcd_clear(void)
{
    memset(lcd_text_, ' ', 32);
    cursor = 0;
}

void lcd_print_char(uint8_t c)
{
    lcd_text_[cursor] = c;
    if (c < 32)
        ++c;
}

void lcd_command(uint8_t data)
{
    (void) data;
}

void lcd_print_line(uint8_t line, const char* str)
{
    if (line == 0) {
        strncpy(lcd_text_, str, 16);
    } else if (line == 1) {
        strncpy(&lcd_text_[16], str, 16);
    }
}

char* lcd_text() {
    return lcd_text_;
}