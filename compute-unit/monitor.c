#include "monitor.h"

#define _GNU_SOURCE

#include <errno.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>
#include <string.h>

#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <util/delay.h>

#include "ansi.h"
#include "config.h"
#include "fs.h"
#include "lcd.h"
#include "ram.h"
#include "rtc.h"
#include "sdcard.h"
#include "uart.h"
#include "z80.h"
#include "fsfat/ff.h"

bool in_monitor = false;

typedef struct {
    char*    command;
    size_t   npars;
    char*    par[8];
    uint16_t ipar[8];
    uint16_t hpar[8];
} UserInput;

//
// UTIL
//

static void print_array(uint8_t* bytes, size_t sz)
{
    printf_P(PSTR(BOLD "%6c"), ' ');
    for (size_t i = 0; i < 16; ++i)
        printf_P(PSTR(" _%X"), i);
    puts_P(PSTR(RST));

    for (uint16_t i = 0; i < sz / 16; ++i) {
        printf_P(PSTR(BOLD "%04X: " RST), i * 0x10);
        for (uint8_t j = 0; j < 16; ++j) {
            if (j == 8)
                putchar(' ');
            printf_P(PSTR(" %02X"), bytes[i * 0x10 + j]);
        }
        putchar('\n');
    }
}

static long long xtoi(char* value)
{
    unsigned long xvalue = strtoul(value, NULL, 16);
    if (errno != 0) {
        puts_P(PSTR(RED "Invalid number" RST));
        return -1;
    } 
    return (long long) xvalue;
}

// 
// INPUT/OUTPUT
//

static void prompt(void)
{
    printf_P(PSTR("[F3] %s> "), "/");  // TODO - use current directory
}

static void parse_input(UserInput *uinput, char* buffer, size_t sz)
{
    uinput->command = buffer;
    uinput->npars = 0;

    for (size_t i = 0; i < sz; ++i) {
        if (buffer[i] == ' ') {
            ++uinput->npars;
            uinput->par[uinput->npars - 1] = &buffer[i + 1];
            buffer[i] = 0;
            ++i;
        }
    }
}

static void input(UserInput *uinput, char* buffer, size_t sz)
{
    size_t pos = 0;

    for (;;) {
        char c = getchar();
        if (c == 10 || c == 13) {
            putchar('\n');
            break;
        } else if (c >= 32 && c < 127 && pos < sz) {
            if (!(pos == 0 && c == 32)) {
                putchar(c);
                buffer[pos++] = c;
            }
        } else if ((c == 127 || c == 8) && pos > 0) {
            printf_P(PSTR("\b \b"));
            --pos;
        }
    }
    buffer[pos] = '\0';

    parse_input(uinput, buffer, pos);
}

static size_t input_bytes(uint8_t* bytes, size_t max_sz)
{
    size_t max_input = max_sz * 3 - 1;
    char buffer[max_input + 1];
    buffer[0] = '\0';
    size_t pos = 0;

    printf_P(PSTR("Type up to %d bytes here (format: 00 00 00...): "), max_sz);

    for (;;) {
        char c = getchar();
        if (c == 10 || c == 13) {
            putchar('\n');
            break;
        } else if ((pos % 3 == 0 || pos % 3 == 1) && 
                ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'F') || (c >= 'a' && c <= 'f'))) {
            putchar(c);
            buffer[pos++] = c;
        } else if (pos % 3 == 2 && c == ' ') {
            putchar(c);
            buffer[pos++] = c;
        } else if (c == 127 && pos > 0) {
            printf_P(PSTR("\b \b"));
            --pos;
        }    
    }
    buffer[pos] = '\0';

    size_t count = 0;
    for (size_t i = 0; i <= pos; i += 3) {
        char* endptr = (char *) &buffer[i+1];
        bytes[i / 3] = strtoul((char *) &buffer[i], &endptr, 16);
        ++count;
    }
    return count;
}

//
// HELP
//

static void help(void)
{
    puts_P(PSTR("  help                      Print this help."));
    puts_P(PSTR("  rtc"));
    puts_P(PSTR("    get                     Read Real Time Clock current value"));
    puts_P(PSTR("    set YY MM DD HH NN SS   Set Real Time Clock value"));
    puts_P(PSTR("  lcd"));
    puts_P(PSTR("    clear                   Clear LCD screen"));
    puts_P(PSTR("    cmd BYTE                Send a command to the LCD (1602)"));
    puts_P(PSTR("    line[1,2] TEXT          Replace line 1 of the LCD with this text"));
    puts_P(PSTR("  ram"));
    puts_P(PSTR("    bank BANK               Set RAM bank [0..7]"));
    puts_P(PSTR("    get BLOCK               Read RAM block"));
    puts_P(PSTR("    write BLOCK OFFSET      Write bytes to RAM, starting at offset"));
    puts_P(PSTR("  z80"));
    puts_P(PSTR("    reset                   Resets the CPU"));
#if INCLUDE_SDCARD
    puts_P(PSTR("  sd"));
    puts_P(PSTR("    get BLOCK               Read SDCard block"));
    puts_P(PSTR("    write BLOCK OFFSET      Write bytes to SDCard, starting at offset"));
    // puts_P(PSTR("  format                    Create a single partition disk, and format it"));
#endif
    puts_P(PSTR("  exit                      Exit monitor and continue execution"));
}

//
// RTC
//

static void rtc_read(void)
{
    ClockDateTime dt = rtc_get();
    printf_P(PSTR("%02d/%02d/%02d %02d:%02d:%02d\n"), dt.mm, dt.dd, dt.yy, dt.hh, dt.nn, dt.ss);
}

static void rtc_store(UserInput* u)
{
    unsigned long yy = strtoul(u->par[1], NULL, 10);
    unsigned long mm = strtoul(u->par[2], NULL, 10);
    unsigned long dd = strtoul(u->par[3], NULL, 10);

    ClockDateTime dt = { .yy = yy, .mm = mm, .dd = dd };

    if (yy == 0 || mm == 0 || dd == 0)
        goto error;

    dt.hh = strtoul(u->par[4], NULL, 10);
    if (errno != 0)
        goto error;
    dt.nn = strtoul(u->par[5], NULL, 10);
    if (errno != 0)
        goto error;
    dt.ss = strtoul(u->par[6], NULL, 10);
    if (errno != 0)
        goto error;

    rtc_set(dt);
    puts_P(PSTR("Clock is set."));
    return;

error:
    puts_P(PSTR(RED "Invalid date value" RST));
}

//
// LCD
// 

static void lcd_cmd(UserInput *u)
{
    int cmd = xtoi(u->par[2]);
    if (cmd == -1)
        return;

    lcd_command(cmd);
}

//
// SD CARD
// 

#if INCLUDE_SDCARD

static void sd_get(UserInput *u)
{
    long long block = xtoi(u->par[1]);
    if (block == -1)
        return;

    uint8_t bytes[512] = { 0 };
    if (!sdcard_read_block(block, bytes)) {
        puts_P(PSTR(RED "Error reading from SDCard." RST));
        return;
    }

    print_array(bytes, 512);
}

static void sd_write(UserInput *u)
{
    int block = xtoi(u->par[1]);
    int offset = xtoi(u->par[2]);
    if (block < 0 || offset < 0)
        return;

    size_t max_sz = 64;
    if (512 - offset < 32)
        max_sz = 512 - offset;
    uint8_t ibytes[max_sz];
    size_t sz = input_bytes(ibytes, max_sz);

    uint8_t bytes[512] = { 0 };
    if (!sdcard_read_block(block, bytes)) {
        puts_P(PSTR(RED "Error reading from SDCard." RST));
        return;
    }
    memcpy(&bytes[offset], ibytes, sz);

    if (!sdcard_write_block(block, bytes)) {
        puts_P(PSTR(RED "Error writing to SDCard." RST));
        return;
    }

    sd_get(u);
}

#endif

// 
// RAM
//

static void ram_print_bank(void)
{
    printf_P(PSTR("RAM bank is %d.\n"), ram_bank());
}

static void ram_bank_set(UserInput *u)
{
    int bank = xtoi(u->par[1]);
    if (bank == -1)
        return;
    bank &= 0x7;

    ram_set_bank(bank);
    ram_print_bank();
}

static void ram_get(UserInput *u)
{
    int block = xtoi(u->par[1]);
    if (block == -1)
        return;

    uint8_t bytes[256] = { 0 };
    ram_read_block(block, bytes);

    ram_print_bank();
    print_array(bytes, 256);
}

static void ram_write(UserInput *u)
{
    int block = xtoi(u->par[1]);
    int offset = xtoi(u->par[2]);
    if (block < 0 || offset < 0)
        return;

    size_t max_sz = 64;
    if (512 - offset < 32)
        max_sz = 512 - offset;
    uint8_t ibytes[max_sz];
    size_t sz = input_bytes(ibytes, max_sz);

    for (size_t i = 0; i < sz; ++i)
        ram_set_byte(block * 0x100 + i + offset, ibytes[i]);

    ram_get(u);
}

//
// DISK OPERATIONS
//

static void syntax_error(void)
{
    puts_P(PSTR(RED "Syntax error." RST));
}

static void execute(UserInput *u, bool* quit, bool *reset_z80)
{
    if (u->npars == 0 && strcmp_P(u->command, PSTR("")) == 0) {
        return;
    } else if (u->npars == 0 && strcmp_P(u->command, PSTR("help")) == 0) {
        help();
    } else if (strcmp_P(u->command, PSTR("rtc")) == 0) {
        if (u->npars == 1 && strcmp_P(u->par[0], PSTR("get")) == 0)
            rtc_read();
        else if (u->npars == 7 && strcmp_P(u->par[0], PSTR("set")) == 0)
            rtc_store(u);
        else
            syntax_error();
    } else if (strcmp_P(u->command, PSTR("lcd")) == 0) {
        if (u->npars == 1 && strcmp_P(u->par[0], PSTR("clear")) == 0)
            lcd_clear();
        else if (u->npars == 2 && strcmp_P(u->par[0], PSTR("cmd")) == 0)
            lcd_cmd(u);
        else if (u->npars == 2 && strcmp_P(u->par[0], PSTR("line1")) == 0)
            lcd_print_line(0, u->par[1]);
        else if (u->npars == 2 && strcmp_P(u->par[0], PSTR("line2")) == 0)
            lcd_print_line(1, u->par[1]);
        else
            syntax_error();
    } else if (strcmp_P(u->command, PSTR("ram")) == 0) {
        if (u->npars == 2 && strcmp_P(u->par[0], PSTR("bank")) == 0)
            ram_bank_set(u);
        else if (u->npars == 2 && strcmp_P(u->par[0], PSTR("get")) == 0)
            ram_get(u);
        else if (u->npars == 3 && strcmp_P(u->par[0], PSTR("write")) == 0)
            ram_write(u);
        else
            syntax_error();
    } else if (strcmp_P(u->command, PSTR("z80")) == 0) {
        if (u->npars == 1 && strcmp_P(u->par[0], PSTR("reset")) == 0) {
            puts_P(PSTR("Z80 will be reset after monitor finishes."));
            *reset_z80 = true;
        }
#if INCLUDE_SDCARD
    } else if (strcmp_P(u->command, PSTR("sd")) == 0) {
        if (u->npars == 2 && strcmp_P(u->par[0], PSTR("get")) == 0)
            sd_get(u);
        else if (u->npars == 3 && strcmp_P(u->par[0], PSTR("write")) == 0)
            sd_write(u);
        else
            syntax_error();
    } else if (strcmp_P(u->command, PSTR("format")) == 0) {
        fs_format();
#endif
    } else if (strcmp_P(u->command, PSTR("exit")) == 0) {
        *quit = true;
    } else {
        syntax_error();
    }
}

//
// MAIN PROCEDURE
//

void monitor(void)
{
    char buffer[255];
    UserInput uinput;

    z80_release_bus();

    puts_P(PSTR("Fortuna-3 monitor program initialized. Type 'help' for help."));

    bool quit = false;
    bool reset_z80 = false;
    while (!quit) {
        prompt();
        input(&uinput, buffer, sizeof buffer);
        execute(&uinput, &quit, &reset_z80);
    }

    z80_continue_execution();
    if (reset_z80)
        z80_reset();
}

// vim:ts=4:sts=4:sw=4:expandtab
