#include <emscripten/emscripten.h>

#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>
#include <stdbool.h>

#include "globals.h"

#include "ram.h"
#include "sdcard.h"

#include "z80/Z80.h"
#include "miniz/miniz.h"

#define KB *1024
#define MB KB*1024

static Z80 z80 = { 0 };

static uint8_t* sdimg_z = NULL;
static unsigned long sdimg_sz = 0;

char last_error[0x200] = { 0 };

EMSCRIPTEN_KEEPALIVE bool initialize(size_t sdcard_sz_in_mb)
{
    ResetZ80(&z80);
    ram_init(512 KB);

    return sdcard_init(sdcard_sz_in_mb MB);
}

/* State format:
 *
 *  [0x000 - 0x???] : Z80
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
    data[0x10] = z80.AF.B.l;
    data[0x11] = z80.AF.B.h;
    data[0x12] = z80.BC.B.l;
    data[0x13] = z80.BC.B.h;
    data[0x14] = z80.DE.B.l;
    data[0x15] = z80.DE.B.h;
    data[0x16] = z80.HL.B.l;
    data[0x17] = z80.HL.B.h;
    data[0x18] = z80.I;

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

EMSCRIPTEN_KEEPALIVE int compress_sdcard_image()
{
	sdimg_sz = compressBound(sdcard_sz);
	sdimg_z = calloc(1, sdimg_sz);
	if (!sdimg_z)
		ERROR("Could not allocate enough memory to create image.");

	int r = compress(sdimg_z, &sdimg_sz, (const unsigned char *) sd_data, sdcard_sz);
    if (r != Z_OK)
		ERROR("Error %d while compressing image.", r);

	return sdimg_sz;
}

EMSCRIPTEN_KEEPALIVE int get_compressed_sdcard_image_page(size_t page, size_t page_size, uint8_t* data)
{
	for (size_t i = 0; i < sdimg_sz; ++i)
		data[i] = sdimg_z[i];
	return sdimg_sz;

	/*
	for (int i = 0; i < 512; ++i)
		data[i] = i & 0xff;
	return 512;

	int r = page_size;
	if ((page + 1) * page_size > sdimg_sz)
		r = sdimg_sz - (page * page_size);
	if (r > 0) {
		for (int i = 0; i < r; ++i)
			data[i] = i & 0xff;
		// memcpy(data, &sdimg_z[page * page_size], r);
	}
	return r < 0 ? 0 : r;
	*/
}

EMSCRIPTEN_KEEPALIVE void delete_compressed_sdcard_image()
{
	free(sdimg_z);
	sdimg_z = NULL;
	sdimg_sz = 0;
}

void emscripten_notify_memory_growth(size_t i) { (void) i; }

// vim: ts=4:sts=4:sw=4:noexpandtab
