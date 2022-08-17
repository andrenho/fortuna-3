#include "remote.h"

#include <stdio.h>

#include <avr/pgmspace.h>
#include <util/delay.h>

#include "lcd.h"
#include "z80.h"

void remote(void)
{
    lcd_clear();

    z80_shutdown();
    _delay_ms(1);

    lcd_print_line_P(0, PSTR("Remote control"));
    
    while (true) {
        uint8_t c = getchar();
    }
}

// vim:ts=4:sts=4:sw=4:expandtab
