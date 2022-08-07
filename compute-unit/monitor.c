#include "monitor.h"

#include <errno.h>
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

#include <avr/interrupt.h>

#include "debug.h"
#include "lcd.h"
#include "rtc.h"
#include "sdcard.h"
#include "uart.h"

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
    print_P(PSTR(BOLD));
    for (size_t i = 0; i < 6; ++i) putchar(' ');
    for (size_t i = 0; i < 16; ++i) {
        print_P(PSTR(" _"));
        putchar(i + (i < 10 ? '0' : 'A' - 10));
    }
    puts_P(PSTR(RST));

    for (uint16_t i = 0; i < sz / 16; ++i) {
        print_P(PSTR(BOLD));
        printhex16(i * 0x10);
        print_P(PSTR(": "));
        print_P(PSTR(RST));
        for (uint8_t j = 0; j < 16; ++j) {
            putchar(' ');
            if (j == 8)
                putchar(' ');
            printhex(bytes[i * 0x10 + j]);
        }
        putchar('\n');
    }
}

static int xtoi(char* value)
{
    unsigned long xvalue = strtoul(value, NULL, 16);
    if (errno != 0) {
        puts_P(PSTR(RED "Invalid number" RST));
        return -1;
    } 
    return (int) xvalue;
}

// 
// INPUT/OUTPUT
//

static void prompt(void)
{
    print_P(PSTR("[F3] "));
    putchar('/');                   // TODO - use current directory
    print_P(PSTR("> "));
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
        } else if (c == 127 && pos > 0) {
            print_P(PSTR("\b \b"));
            --pos;
        }
    }
    buffer[pos] = '\0';

    parse_input(uinput, buffer, pos);
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
    puts_P(PSTR("  sd"));
    puts_P(PSTR("    get BLOCK               Read SDCard block"));
    puts_P(PSTR("    set BLOCK OFFSET        Write bytes to SDCard, starting at offset"));
}

//
// RTC
//

static void rtc_read(void)
{
    ClockDateTime dt = rtc_get();
    printdec(dt.mm, 2); putchar('/'); printdec(dt.dd, 2); putchar('/'); printdec(dt.yy, 2);
    putchar(' ');
    printdec(dt.hh, 2); putchar(':'); printdec(dt.nn, 2); putchar(':'); printdec(dt.ss, 2);
    putchar('\n');
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

    lcd_command(1, cmd);
}

//
// SD CARD
// 

static void sd_get(UserInput *u)
{
    int block = xtoi(u->par[2]);
    if (block == -1)
        return;

    uint8_t bytes[512];
    if (!sdcard_read_block(block, bytes)) {
        puts_P(PSTR(RED "Error reading from SDCard." RST));
        return;
    }

    print_array(bytes, 512);
}

static void sd_set(UserInput *u)
{
}

//
// EXECUTE COMMANDS
// 

static void syntax_error(void)
{
    puts_P(PSTR(RED "Syntax error." RST));
}

static void execute(UserInput *u)
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
            lcd_print_line1(u->par[1]);
        else if (u->npars == 2 && strcmp_P(u->par[0], PSTR("line2")) == 0)
            lcd_print_line2(u->par[1]);
        else
            syntax_error();
    } else if (strcmp_P(u->command, PSTR("sd")) == 0) {
        if (u->npars == 2 && strcmp_P(u->par[0], PSTR("get")) == 0)
            sd_get(u);
        else if (u->npars == 3 && strcmp_P(u->par[0], PSTR("set")) == 0)
            sd_set(u);
        else
            syntax_error();
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

    puts_P(PSTR("Fortuna-3 monitor program initialized. Type 'help' for help."));

    while (1) {
        prompt();
        input(&uinput, buffer, sizeof buffer);
        execute(&uinput);
    }
}

// vim:ts=4:sts=4:sw=4:expandtab
