#include "remote.h"

#include <stdio.h>

#include <avr/pgmspace.h>
#include <util/delay.h>

#include "lcd.h"
#include "ram.h"
#include "z80.h"

#define CMD_UPLOAD_RAM  0x1
#define CMD_FORMAT_SD   0x2
#define CMD_CREATE_FILE 0x3
#define CMD_EXIT        0xff

#define OK                 0x0
#define ERR_GENERIC        0x1
#define ERR_FILE_TOO_LARGE 0x2
#define ERR_SD_ERROR       0x3
#define ERR_INVALID_CMD    0x4

static void upload_to_ram(void)
{
    uint8_t bank = getchar();

    uint16_t location = getchar();
    location |= ((uint16_t) getchar()) << 8;
    uint16_t sz = getchar();
    sz |= ((uint16_t) getchar()) << 8;

    if (((uint32_t) sz + location) > ((uint32_t) 64 * 1024)) {
        putchar(ERR_FILE_TOO_LARGE);
        return;
    }

    ram_set_bank(bank);
    for (size_t i = 0; i < sz; ++i)
        ram_set_byte(i + location, getchar());

    putchar(OK);
}

void remote(void)
{
    z80_shutdown();
    _delay_ms(1);

    while (true) {
        uint8_t c = getchar();
        switch (c) {
            case CMD_UPLOAD_RAM:
                upload_to_ram();
                break;
            case CMD_EXIT:
                lcd_clear();
                lcd_print_line_P(0, PSTR("Remote complete"));
                lcd_print_line_P(1, PSTR("Press USR"));
                loop_until_bit_is_clear(PIND, PIND3);
                lcd_clear();
                return;
            default:
                putchar(ERR_INVALID_CMD);
        }
    }
}

// vim:ts=4:sts=4:sw=4:expandtab
