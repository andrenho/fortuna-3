#include "io/iolcd.h"

#include "dev/lcd.h"
#include "dev/ram.h"

void io_lcd_print_line(uint8_t line_number, uint16_t addr)
{
    char buf[17] = { 0 };
    for (uint8_t i = 0; i < 16; ++i) {
        uint8_t data = ram_get_byte(addr + i);
        if (data == 0) {
            buf[i] = 0;
            break;
        }
        buf[i] = data;
    }
    lcd_print_line(line_number, buf);
}

// vim:ts=4:sts=4:sw=4:expandtab
