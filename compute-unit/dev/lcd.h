#ifndef LCD_H_
#define LCD_H_

#ifndef EMULATOR
#  include <avr/pgmspace.h>
#endif

#include <stdbool.h>
#include <stdint.h>

void lcd_init(void);
void lcd_clear(void);
void lcd_print_char(uint8_t c);

void lcd_command(uint8_t data);
void lcd_print_line(uint8_t line, const char* str);

#ifndef EMULATOR
  void lcd_print_line_P(uint8_t line, PGM_P p);
#endif

#endif

// vim:ts=4:sts=4:sw=4:expandtab
