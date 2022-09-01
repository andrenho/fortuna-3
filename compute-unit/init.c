#include "init.h"

#include <stdio.h>

#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <util/delay.h>

#include "ansi.h"
#include "config.h"
#include "dev/lcd.h"
#include "dev/ram.h"
#include "dev/rtc.h"
#include "dev/sdcard.h"
#include "dev/spi.h"
#include "dev/uart.h"
#include "dev/z80.h"
#include "io/random.h"

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
    uint8_t block1[256], block2[256];
    for (size_t i = 0; i < 256; ++i)
        block1[i] = random();

    post_checking(PSTR("RAM"));
    ram_write_array(0, block1, 256);
    ram_read_array(0, block2, 256);

    for (size_t i = 0; i < 256; ++i) {
        if (block1[i] != block2[i]) {
            post_error(PSTR("RAM ckeck"), PSTR("failed"));
            return;
        }
    }
    post_ok();
}

static void test_z80(void)
{
    post_checking(PSTR("Z80"));

    uint8_t expected = random();

    z80_shutdown();
    ram_set_byte(0, 0x3e); // ld a, RANDOM
    ram_set_byte(1, expected);
    ram_set_byte(2, 0x32); // ld (0x1234), a
    ram_set_byte(3, 0x34);
    ram_set_byte(4, 0x12);
    ram_set_byte(5, 0x18); // jr -2
    ram_set_byte(6, 0xfe);

    z80_reset();
    _delay_ms(1);
    z80_shutdown();

    if (ram_get_byte(0x1234) == expected)
        post_ok();
    else
        post_error(PSTR("Z80 execution"), PSTR("failed"));
}

static void test_z80_io(void)
{
    post_checking(PSTR("Z80 I/O"));

    uint8_t expected = random();

    z80_shutdown();
    ram_set_byte(0, 0x3e); // ld a, RANDOM
    ram_set_byte(1, expected);
    ram_set_byte(2, 0xd3); // out (0xff), a
    ram_set_byte(3, 0xff);
    ram_set_byte(4, 0x18); // jr -2
    ram_set_byte(5, 0xfe);

    z80_reset();
    z80_loop_while_iorq_high();
    z80_iorq();
    _delay_ms(1);
    z80_shutdown();
    
    if (z80_post_test() == expected)
        post_ok();
    else
        post_error(PSTR("Z80 I/O test"), PSTR("failed"));
}

static void test_sdcard(void)
{
    post_checking(PSTR("SD Card"));

    uint8_t buffer[512];
    if (!sdcard_read_block(0, buffer))
        post_error(PSTR("SD Card error"), PSTR("on reading block"));
    else if (buffer[510] != 0x55 || buffer[511] != 0xaa)
        post_error(PSTR("SD Card boot"), PSTR("sector not found"));
    else
        post_ok();
}

static void post(void)
{
    test_lcd();
    test_rtc();
    test_ram();
    test_z80();
    test_z80_io();
#if INCLUDE_SDCARD
    test_sdcard();
#endif
}

void initialize(void)
{
    _delay_ms(150);

    uart_init();
    puts_P(PSTR("\e[1;1H\e[2J"));   // clear screen

#if DEBUG_RESET_REASON
    debug_reset_reason();
#endif

    uint32_t seed = random_init();
    printf_P(PSTR("Random seed is 0x%lX.\n"), seed);

    rtc_init();
    spi_init();
    ram_init();
    z80_init();
    lcd_init();

#if INCLUDE_SDCARD
    sdcard_init();

    if (!sdcard_setup()) {
        puts_P(PSTR(RED "Error initializing SDCard." RST));
        for (;;);
    }
#endif

    post();
}

// vim:ts=4:sts=4:sw=4:expandtab
