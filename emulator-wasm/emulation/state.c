#include <emscripten/emscripten.h>

#include "state.h"

#include <string.h>

#include "dev/lcd.h"
#include "dev/eeprom.h"
#include "dev/ram.h"
#include "dev/rtc.h"
#include "emulation/cpu.h"
#include "emulation/sdcard.h"
#include "io/io.h"
#include "globals.h"
#include "terminal.h"

char last_error[0x200] = { 0 };

/* State format:
 *
 *  [0x000 - 0x018] : Z80
 *  [0x01a - 0x026] : Compute unit
 *  [0x080 - 0x0e3] : Breakpoints (16-bit)
 *  [0x0e4]         : RAM banks
 *  [0x0e8 - 0x0ff] : Stack
 *  [0x100 - 0x1ff] : RAM
 *  [0x200 - 0x3ff] : SDCard
 *  [0x400 - 0x5ff] : Last error
 *  [0x600 - 0x6ff] : EEPROM
 *  [0x700 - 0x71f] : LCD
 *  [0x720 - 0x725] : RTC
 */
EMSCRIPTEN_KEEPALIVE void get_state(uint16_t ram_page, size_t sd_page, uint16_t eeprom_page, uint8_t* data)
{
    data[0x0] = z80.AF.B.l;
    data[0x1] = z80.AF.B.h;
    data[0x2] = z80.BC.B.l;
    data[0x3] = z80.BC.B.h;
    data[0x4] = z80.DE.B.l;
    data[0x5] = z80.DE.B.h;
    data[0x6] = z80.HL.B.l;
    data[0x7] = z80.HL.B.h;
    data[0x8] = z80.IX.B.l;
    data[0x9] = z80.IX.B.h;
    data[0xa] = z80.IY.B.l;
    data[0xb] = z80.IY.B.h;
    data[0xc] = z80.PC.B.l;
    data[0xd] = z80.PC.B.h;
    data[0xe] = z80.SP.B.l;
    data[0xf] = z80.SP.B.h;
    data[0x10] = z80.AF1.B.l;
    data[0x11] = z80.AF1.B.h;
    data[0x12] = z80.BC1.B.l;
    data[0x13] = z80.BC1.B.h;
    data[0x14] = z80.DE1.B.l;
    data[0x15] = z80.DE1.B.h;
    data[0x16] = z80.HL1.B.l;
    data[0x17] = z80.HL1.B.h;
    data[0x18] = z80.I;

    // Compute unit
    for (size_t i = 0; i < 12; ++i)
        data[i + 0x1a] = io_read(i);

    // Breakpoints
    for (size_t i = 0; i < MAX_BKPS; ++i) {
        data[0x80 + (i * 2)] = bkp[i] & 0xff;
        data[0x80 + (i * 2) + 1] = bkp[i] >> 8;
    }

    // RAM banks
    data[0xe4] = ram_bank();

    // stack
    for (uint16_t addr = 0; addr < 24; ++addr)
        data[addr + 0xe8] = ram_get_byte(z80.SP.W + addr);

    // RAM
    ram_read_array(ram_page * RAM_PAGE_SZ, &data[0x100], RAM_PAGE_SZ);

    // SD Card
    sdcard_copy_page(sd_page, &data[0x200]);

    // last error
    memcpy(&data[0x400], last_error, sizeof last_error);

    // eeprom
    eeprom_copy_page(eeprom_page, &data[0x600]);

    // lcd
    memcpy(&data[0x700], lcd_text(), 32);

    // rtc
    ClockDateTime clk = rtc_get();
    data[0x720] = clk.yy;
    data[0x721] = clk.mm;
    data[0x722] = clk.dd;
    data[0x723] = clk.hh;
    data[0x724] = clk.nn;
    data[0x725] = clk.ss;
}

EMSCRIPTEN_KEEPALIVE size_t max_printed_chars()
{
    return MAX_PRINTED_CHARS;
}

