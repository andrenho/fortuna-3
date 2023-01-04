#include "remote.h"

#include <stdio.h>

#include <avr/pgmspace.h>
#include <util/delay.h>
#include "fsfat/ff.h"

#include "dev/lcd.h"
#include "dev/ram.h"
#include "dev/uart.h"
#include "dev/z80.h"
#include "io/iofs.h"

#define CMD_FORMAT_SD   'F'
#define CMD_CREATE_FILE 'C'
#define CMD_EXIT        'X'

#define OK                 0x0
#define ERR_GENERIC        'g'
#define ERR_FILE_TOO_LARGE 'l'
#define ERR_SD_ERROR       's'
#define ERR_INVALID_CMD    'i'

#define BUF_SZ 512U

#define min(a,b)             \
({                           \
    __typeof__ (a) _a = (a); \
    __typeof__ (b) _b = (b); \
    _a < _b ? _a : _b;       \
})

static uint8_t getch(void)
{
    loop_until_bit_is_set(UCSR0A, RXC0);
    return UDR0;
}

void remote_init(void)
{
    DDRH &= ~(1 << PINH5);
}

bool remote_active(void)
{
    return !(PINH & (1 << PINH5));
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
    uint8_t filename_sz = getch();

    uint32_t file_sz = getch();
    file_sz |= ((uint32_t) getch()) << 8;
    file_sz |= ((uint32_t) getch()) << 16;
    file_sz |= ((uint32_t) getch()) << 24;

    // get filename
    char filename[15] = { 0 };
    for (size_t i = 0; i < filename_sz; ++i)
        filename[i] = getch();

    // show info on LCD
    lcd_clear();
    lcd_print_line_P(0, PSTR("Creating file"));
    lcd_print_line(1, filename);

    // receive file and write to SD
    FATFS fs;
    FIL fp;
    uint8_t buf[BUF_SZ];
#define FR(cmd) { FRESULT __r; if ((__r = (cmd)) != FR_OK) { putchar(__r); return; } }
    FR(f_mount(NULL, "0:", 0))
    FR(f_mount(&fs, "0:", 0))
    FR(f_open(&fp, filename, FA_CREATE_ALWAYS | FA_WRITE))
    while (file_sz > 0) {
        for (size_t i = 0; i < min(BUF_SZ, file_sz); ++i) {
            buf[i] = getch();
        }

        UINT bytes_written;
        FR(f_write(&fp, buf, min(BUF_SZ, file_sz), &bytes_written))
        file_sz -= bytes_written;
    }
    FR(f_close(&fp))
#undef FR

    lcd_print_line_P(0, PSTR("Created file"));
    putchar(OK);
}

void remote_execute(void)
{
    UCSR0B &= ~(1<<RXCIE0);   // disable UART0 interrupt
    z80_shutdown();
    _delay_ms(1);

    lcd_clear();
    lcd_print_line_P(0, PSTR("Waiting"));
    lcd_print_line_P(1, PSTR("remote..."));

    while (true) {
        uint8_t c = getch();
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
