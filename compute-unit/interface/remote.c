#include "remote.h"

#include <stdio.h>

#include <avr/pgmspace.h>
#include <util/delay.h>

#include "dev/lcd.h"
#include "dev/ram.h"
#include "dev/z80.h"
#include "io/iofs.h"

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
            case CMD_FORMAT_SD:
                {
                    lcd_clear();
                    lcd_print_line_P(0, PSTR("Formatting"));
                    lcd_print_line_P(1, PSTR("SDCard..."));

                    IO_Regs r = {0};
                    io_fs_format(&r);
                    if (r.Ra0 == 0) {
                        lcd_print_line_P(1, PSTR("complete."));
                        putchar(OK);
                    }
                    else {
                        lcd_print_line_P(1, PSTR("error!"));
                        putchar(r.Ra0);
                    }
                }
                break;
            default:
                putchar(ERR_INVALID_CMD);
        }
    }
}

// vim:ts=4:sts=4:sw=4:expandtab
