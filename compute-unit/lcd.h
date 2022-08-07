#ifndef LCD_H_
#define LCD_H_

#include <stdbool.h>
#include <stdint.h>

void lcd_init(void);
void lcd_clear(void);
void lcd_print_char(uint8_t c);
void lcd_print(char* str);
void lcd_command(bool rs, uint8_t data);

void lcd_full_command(uint8_t data);
void lcd_print_line1(char* str);
void lcd_print_line2(char* str);

#endif

// vim:ts=4:sts=4:sw=4:expandtab
