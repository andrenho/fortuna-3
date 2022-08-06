#include "monitor.h"

#include <stdio.h>
#include <stdint.h>

#include <avr/interrupt.h>

#include "debug.h"

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
        } else if (c == 127) {
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

static void rtc_get(void)
{
    puts_P(PSTR("XXX"));
}

//
// EXECUTE COMMANDS
// 

static void execute(UserInput *u)
{
    if (u->npars == 0 && strcmp_P(u->command, PSTR("help")) == 0)
        help();
    else if (u->npars == 1 && strcmp_P(u->command, PSTR("rtc")) == 0 && strcmp_P(u->par[0], PSTR("get")) == 0)
        rtc_get();
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
