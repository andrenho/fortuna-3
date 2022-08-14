#include "init.h"

#include <stdio.h>

#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <util/delay.h>

#include "ansi.h"
#include "config.h"
#include "fs.h"
#include "lcd.h"
#include "ram.h"
#include "random.h"
#include "rtc.h"
#include "sdcard.h"
#include "spi.h"
#include "uart.h"
#include "usr.h"
#include "z80.h"

#include "fsfat/ff.h"

#if DEBUG_RESET_REASON
static void debug_reset_reason(void)
{
    printf_P(PSTR("Reset reason: "));
    if (MCUSR & _BV(JTRF))
        printf_P(PSTR("JTAG "));
    if (MCUSR & _BV(WDRF))
        printf_P(PSTR("watchdog "));
    if (MCUSR & _BV(BORF))
        printf_P(PSTR("brown-out "));
    if (MCUSR & _BV(EXTRF))
        printf_P(PSTR("external reset "));
    if (MCUSR & _BV(PORF))
        printf_P(PSTR("power-on "));
    putchar('\n');

    MCUSR = 0;
}
#endif

static void post_checking(PGM_P dev)
{
    printf_P(PSTR("Checking "));
    printf_P(dev);
    printf_P(PSTR("... "));
}

static void post_ok(void)
{
    puts_P(PSTR(GRN "ok" RST));
}

static void post_error(PGM_P line1, PGM_P line2)
{
    printf_P(PSTR(RED "FAIL: "));
    printf_P(line1);
    putchar(' ');
    printf_P(line2);
    puts_P(PSTR(RST));
    lcd_print_line_P(0, line1);
    lcd_print_line_P(1, line2);
}

static void test_lcd(void)
{
    lcd_print_line_P(0, PSTR("Welcome to"));
    lcd_print_line_P(1, PSTR("Fortuna-3! :)"));
}

static void test_rtc(void)
{
    post_checking(PSTR("RTC"));
    ClockDateTime dt = rtc_get();
    if (dt.dd == 0)
        post_error(PSTR("RTC unset or"), PSTR("unavailable"));
    else
        post_ok();
}

static void test_ram(void)
{
}

static void test_sdcard(void)
{
}

static void test_z80(void)
{
}

static void post(void)
{
    test_lcd();
    test_rtc();
    test_ram();
    test_sdcard();
    test_z80();
}

static void setup_sdcard(void)
{
#if INCLUDE_SDCARD
    if (!sdcard_setup()) {
        puts_P(PSTR(RED "Error initializing SDCard." RST));
        for (;;);
    }
    if (!fs_mount()) {
        puts_P(PSTR(RED "Error mounting partition." RST));
        for (;;);
    }
    putchar('\n');
#endif
}

void initialize(void)
{
    _delay_ms(200);

    uart_init();
    puts_P(PSTR("\e[1;1H\e[2J"));   // clear screen

#if DEBUG_RESET_REASON
    debug_reset_reason();
#endif

    uint32_t seed = random_init();
    printf_P(PSTR("Random seed is 0x%lX.\n"), seed);

    usr_init();
    rtc_init();
    spi_init();
    ram_init();
    z80_init();
    lcd_init();

#if INCLUDE_SDCARD
    sdcard_init();
#endif

    post();

    setup_sdcard();
}

// vim:ts=4:sts=4:sw=4:expandtab
