#include "monitor.h"

#include <errno.h>
#include <stdio.h>
#include <stdint.h>
#include <stdlib.h>

#include <avr/interrupt.h>

#include "debug.h"
#include "rtc.h"

typedef struct {
    char*    command;
    size_t   npars;
    char*    par[8];
    uint16_t ipar[8];
    uint16_t hpar[8];
} UserInput;

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
    long yy = strtol(u->par[1], NULL, 10);
    long mm = strtol(u->par[2], NULL, 10);
    long dd = strtol(u->par[3], NULL, 10);

    ClockDateTime dt = { .yy = yy, .mm = mm, .dd = dd };

    if (yy == 0 || mm == 0 || dd == 0)
        goto error;

    dt.hh = strtol(u->par[4], NULL, 10);
    if (errno != 0)
        goto error;
    dt.nn = strtol(u->par[5], NULL, 10);
    if (errno != 0)
        goto error;
    dt.ss = strtol(u->par[6], NULL, 10);
    if (errno != 0)
        goto error;

    rtc_set(dt);
    puts_P(PSTR("Clock is set."));
    return;

error:
    puts_P(PSTR("Invalid date value"));
}

//
// EXECUTE COMMANDS
// 

static void execute(UserInput *u)
{
    if (u->npars == 0 && strcmp_P(u->command, PSTR("")) == 0)
        return;
    else if (u->npars == 0 && strcmp_P(u->command, PSTR("help")) == 0)
        help();
    else if (u->npars == 1 && strcmp_P(u->command, PSTR("rtc")) == 0 && strcmp_P(u->par[0], PSTR("get")) == 0)
        rtc_read();
    else if (u->npars == 7 && strcmp_P(u->command, PSTR("rtc")) == 0 && strcmp_P(u->par[0], PSTR("set")) == 0)
        rtc_store(u);
    else
        puts_P(PSTR("Syntax error."));
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
