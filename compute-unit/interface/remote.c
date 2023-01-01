#include "remote.h"

#include <stdio.h>

#include <avr/pgmspace.h>
#include <util/delay.h>
#include "fsfat/ff.h"

#include "dev/lcd.h"
#include "dev/ram.h"
#include "dev/z80.h"
#include "io/iofs.h"

#define CMD_FORMAT_SD   0x2
#define CMD_CREATE_FILE 0x3
#define CMD_EXIT        0xff

#define OK                 0x0
#define ERR_GENERIC        0x1
#define ERR_FILE_TOO_LARGE 0x2
#define ERR_SD_ERROR       0x3
#define ERR_INVALID_CMD    0x4

#define BUF_SZ 512U

#define min(a,b)             \
({                           \
    __typeof__ (a) _a = (a); \
    __typeof__ (b) _b = (b); \
    _a < _b ? _a : _b;       \
})

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

static void format_sdcard(void)
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

void create_file(void)
{
    // get filename size, and file size
    uint8_t filename_sz = getchar();
    uint32_t file_sz = getchar();
    file_sz |= ((uint32_t) getchar()) << 8;
    file_sz |= ((uint32_t) getchar()) << 16;
    file_sz |= ((uint32_t) getchar()) << 24;

    // get filename
    char filename[15] = { 0 };
    for (size_t i = 0; i < filename_sz; ++i)
        filename[i] = getchar();

    // show info on LCD
    lcd_clear();
    lcd_print_line_P(0, PSTR("Creating file"));
    lcd_print_line(1, filename);

    // receive file and write to SD
    FIL fp;
    uint8_t buf[BUF_SZ];
#define FR(cmd) { FRESULT __r; if ((__r = (cmd)) != FR_OK) { putchar(__r); return; } }
    FR(f_mount(NULL, "0:", 0))
    FR(f_open(&fp, filename, FA_CREATE_ALWAYS | FA_WRITE))
    while (file_sz > 0) {
        for (size_t i = 0; i < min(BUF_SZ, file_sz); ++i)
            buf[i] = getchar();

        UINT bytes_written;
        FR(f_write(&fp, buf, min(BUF_SZ, file_sz), &bytes_written))
        file_sz -= bytes_written;
    }
    FR(f_close(&fp))
#undef FR

    lcd_print_line_P(1, PSTR("complete."));
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
                format_sdcard();
                break;
            case CMD_CREATE_FILE:
                create_file();
                break;
            default:
                putchar(ERR_INVALID_CMD);
        }
    }
}

// vim:ts=4:sts=4:sw=4:expandtab
