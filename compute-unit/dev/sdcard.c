#include "sdcard.h"

#include <avr/pgmspace.h>
#include <util/delay.h>
#include <stdio.h>

#include "ansi.h"
#include "config.h"
#include "dev/spi.h"

#define set_CE()   { PORTG |= _BV(PG5); /* debug_spi_inactive(PSTR("SD")); */ }
#define clear_CE() { PORTG &= ~_BV(PG5); /* debug_spi_active(PSTR("SD")); */ }

#define MAX_READ_ATTEMPTS   20
#define MAX_WRITE_ATTEMPTS 100

static bool was_initialized = false;

static void command(uint8_t cmd, uint32_t args, uint8_t crc)
{
    spi_send(cmd | 0x40);
    spi_send((uint8_t)(args >> 24));
    spi_send((uint8_t)(args >> 16));
    spi_send((uint8_t)(args >> 8));
    spi_send((uint8_t)args);
    spi_send(crc | 0x1);
}

#if DEBUG_SDCARD >= 1
static void print_sdcard_state(uint8_t r1)
{
    if (r1 == 0) printf_P(PSTR("ok "));
    if (r1 & (1 << 0)) printf_P(PSTR("idle "));
    if (r1 & (1 << 1)) printf_P(PSTR("erase_reset "));
    if (r1 & (1 << 2)) printf_P(PSTR("illegal_command "));
    if (r1 & (1 << 3)) printf_P(PSTR("command_crc_error "));
    if (r1 & (1 << 4)) printf_P(PSTR("erase_seq_error "));
    if (r1 & (1 << 5)) printf_P(PSTR("addr_error "));
    if (r1 & (1 << 6)) printf_P(PSTR("param_error "));
}
#endif

void sdcard_init(void)
{
    DDRG = _BV(DDG5);
}

static void sdcard_poweron(void)
{
    // powerup card
    set_CE();
    _delay_ms(1);
    for (uint8_t i = 0; i < 10; ++i)
        spi_send(0xff);

    // deselect card
    set_CE();
    spi_send(0xff);

#if DEBUG_SDCARD >= 1
    printf_P(PSTR(CYN "[SDCard powered on] " RST));
#endif
}

static bool sdcard_software_reset(void)
{
    clear_CE();
    command(0, 0, 0x94);
    uint8_t r1 = spi_recv_ignore_ff();
    set_CE();

#if DEBUG_SDCARD >= 1
    printf_P(PSTR(CYN "[SDCard CMD0 issued: "));
    print_sdcard_state(r1);
    printf_P(PSTR("] " RST));
#endif

    return r1 == 0x1;
}

static bool sdcard_check_voltage_range(void)
{
    clear_CE();
    command(8, 0x1aa, 0x86);
    uint8_t r1 = spi_recv_ignore_ff();
    for (int i = 0; i < 4; ++i)
        spi_send(0xff);
    set_CE();

#if DEBUG_SDCARD >= 1
    printf_P(PSTR(CYN "[SDCard CMD8 issued: "));
    print_sdcard_state(r1);
    printf_P(PSTR("] " RST));
#endif

    return r1 == 0x1;
}

static bool sdcard_initialize(void)
{
    clear_CE();
    command(55, 0, 0);
    uint8_t r1 = spi_recv_ignore_ff();
    set_CE();
    if (r1 != 1) {
#if DEBUG_SDCARD >= 1
        printf_P(PSTR(RED "[Command CMD55 not supported by SDCard.] " RST));
#endif
        return false;
    }
#if DEBUG_SDCARD >= 1
    printf_P(PSTR(CYN "[Command CMD55 accepted: "));
    print_sdcard_state(r1);
    printf_P(PSTR(CYN "] " RST));
#endif

    clear_CE();
    command(41, 0x40000000, 0);
    r1 = spi_recv_ignore_ff();
    set_CE();
    if (r1 != 0) {
#if DEBUG_SDCARD >= 1
        printf_P(PSTR(RED "[Error initializing SDCard (ACMD41): "));
        print_sdcard_state(r1);
        printf_P(PSTR("] " RST));
#endif
        return false;
    }

#if DEBUG_SDCARD >= 1
    printf_P(PSTR(CYN "[SDCard initialized (ACMD41): "));
    print_sdcard_state(r1);
    printf_P(PSTR("] " RST));
#endif

    return true;
}

bool sdcard_setup(void)
{
    sdcard_poweron();
    if (!sdcard_software_reset()) return false;
    if (!sdcard_check_voltage_range()) return false;

    for (int i = 0; i < 16; ++i) {
        if (sdcard_initialize())
            goto initialized;
        _delay_ms(50);
    }
    return false;

initialized:
    was_initialized = true;
    return true;
}

bool sdcard_read_block(uint32_t block, uint8_t* buffer)
{
    clear_CE();

    // send read command
    command(17, block, 0);
    uint8_t r = spi_recv_ignore_ff();
    if (r != 0) {
        set_CE();
#if DEBUG_SDCARD >= 1
        printf_P(PSTR(RED "[SDCard read rejected with 0x%X] " RST), r);
#endif
        return false;
    }

    // read data (skip to `read_data`)
    for (int i = 0; i < MAX_READ_ATTEMPTS; ++i) {
        r = spi_recv_ignore_ff();
        if (r == 0xfe)
            goto read_data;
        _delay_ms(10);
    }
#if DEBUG_SDCARD >= 1
    printf_P(PSTR(RED "[Timeout while reading from SDCard.] " RST));
#endif
    set_CE();
    return false;

read_data:
    for (int i = 0; i < 512; ++i) {
        uint8_t data = spi_recv();
        if (buffer)
            buffer[i] = data;
    }

    // crc
    spi_send(0xff);
    spi_send(0xff);
    set_CE();

#if DEBUG_SDCARD >= 1
    printf_P(PSTR(CYN "[SDCard block 0x%X read.] " RST), block);
#endif
    
    return true;
}

bool sdcard_write_block(uint32_t block, uint8_t const* buffer)
{
    clear_CE();

    // send write command
    command(24, block, 0);
    uint8_t r1 = spi_recv_ignore_ff();
    if (r1 != 0) {
        set_CE();
#if DEBUG_SDCARD >= 1
        printf_P(PSTR(RED "[SDCard write rejected with 0x%02X] " RST), r1);
#endif
        return false;
    }

    // write data to card
    spi_send(0xfe);
    for (uint16_t i = 0; i < 512; ++i)
        spi_send(buffer[i]);

    // wait for confirmation
    for (int i = 0; i < MAX_WRITE_ATTEMPTS; ++i) {
        r1 = spi_recv();
        if (r1 != 0xff)
            goto response_received;
        _delay_ms(10);
    }
#if DEBUG_SDCARD >= 1
    printf_P(PSTR(RED "[Timeout while writing to SDCard.] " RST));
#endif
    set_CE();
    return false;

response_received:
    if ((r1 & 0x1f) != 0x5) {
#if DEBUG_SDCARD >= 1
        printf_P(PSTR(RED "[Data write rejected to SDCard: "));
        print_sdcard_state(r1);
        printf_P(PSTR("] " RST));
#endif
        set_CE();
        return false;
    }

    // wait for write to finalize
    for (int i = 0; i < MAX_WRITE_ATTEMPTS; ++i) {
        r1 = spi_recv_ignore_ff();
        if (r1 != 0x0)
            goto response_data_received;
        _delay_ms(10);
    }
#if DEBUG_SDCARD >= 1
    printf_P(PSTR(RED "[Timeout while waiting for write to SDCard.] " RST));
#endif
    set_CE();
    return false;

response_data_received:
    set_CE();
#if DEBUG_SDCARD >= 1
    printf_P(PSTR(CYN "[SDCard block 0x%X written.]" RST), block);
#endif
    
    return true;
}

bool sdcard_was_initialized(void)
{
    return was_initialized;
}

// vim:ts=4:sts=4:sw=4:expandtab
