#include <emscripten/emscripten.h>

#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>

#include "globals.h"

#include "cpu.h"
#include "ram.h"
#include "sdcard.h"
#include "uart.h"

#include "z80/Z80.h"
#include "miniz/miniz.h"
#include "io/io.h"

#define KB *1024
#define MB KB*1024

static Z80 z80 = { 0 };

char last_error[0x200] = { 0 };

typedef enum { NORMAL = 0, BREAKPOINT = 1 } FinishReason;

EMSCRIPTEN_KEEPALIVE bool initialize(size_t sdcard_sz_in_mb)
{
    ResetZ80(&z80);
    ram_init(512 KB);
    bkp_clear();

    bool r = sdcard_init(sdcard_sz_in_mb MB);
    puts("Emulator initialized.");
    return r;
}

EMSCRIPTEN_KEEPALIVE void step()
{
    ExecZ80(&z80, 1);
}

EMSCRIPTEN_KEEPALIVE FinishReason step_cycles(int cycles)
{
    ExecZ80(&z80, cycles);
    return NORMAL;
}

/* State format:
 *
 *  [0x000 - 0x018] : Z80
 *  [0x01a - 0x026] : Compute unit
 *  [0x080 - 0x0e3] : Breakpoints (16-bit)
 *  [0x0e4 - 0x0e7] : RAM banks
 *  [0x0e8 - 0x0ff] : Stack
 *  [0x100 - 0x1ff] : RAM
 *  [0x200 - 0x3ff] : SDCard
 *  [0x400 - 0x600] : Last error
 */
EMSCRIPTEN_KEEPALIVE void get_state(uint16_t ram_page, size_t sd_page, uint8_t* data)
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
    ram_banks(&data[0xe4]);

    // stack
    for (uint16_t addr = 0; addr < 24; ++addr)
        data[addr + 0xe8] = ram_get(z80.SP.W + addr);

    // RAM
    ram_get_page(ram_page, &data[0x100]);

    // SD Card
    sdcard_copy_page(sd_page, &data[0x200]);

    // last error
    memcpy(&data[0x400], last_error, sizeof last_error);
}

EMSCRIPTEN_KEEPALIVE long compress_sdcard(uint8_t* data, unsigned long data_len)
{
    mz_zip_archive zip;
    mz_zip_zero_struct(&zip);

    if (mz_zip_writer_init_heap(&zip, 0, 128 * 1024) == false)
        ERROR("Error initializing zipper.");
    if (mz_zip_writer_add_mem(&zip, "image.img", sd_data, sdcard_sz, MZ_BEST_COMPRESSION) == false)
        ERROR("Error adding file to archive.");

    void *buf;
    size_t sz;
    if (mz_zip_writer_finalize_heap_archive(&zip, &buf, &sz) == false)
        ERROR("Error adding file to archive.");

    if (sz > data_len)
        ERROR("Not enough space in memory to create zip.");

    memcpy(data, buf, sz);

    mz_zip_writer_end(&zip);

    return sz;
}

EMSCRIPTEN_KEEPALIVE size_t max_printed_chars()
{
    return MAX_PRINTED_CHARS;
}

void emscripten_notify_memory_growth(size_t i) { (void) i; }

// vim: ts=4:sts=4:sw=4:expandtab
