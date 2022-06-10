#include <emscripten/emscripten.h>

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#include "sdcard.h"
#include "fatfs/ff.h"

extern int sd_card_write(unsigned long start_at, unsigned int n_sectors, const uint8_t* data);

EMSCRIPTEN_KEEPALIVE int initialize(long sd_size_mb_, uint8_t* buffer)
{
	sd_size_mb = sd_size_mb_;

	LBA_t plist[] = {100, 0};
	FRESULT r = f_fdisk(0, plist, buffer);
	if (r != FR_OK)
		return r;
	/*
	r = f_mkfs("0:", 0, buffer, 512);
	if (r != FR_OK)
		return r;
		*/

	return FR_OK;
}

/*
EMSCRIPTEN_KEEPALIVE CPUInfo cpu_info()
{
}
*/

EMSCRIPTEN_KEEPALIVE void ram_data(uint16_t page, uint8_t* data)
{
	(void) page;

	for (size_t i = 0; i < 256; ++i)
		data[i] = i;
}

// vim: ts=4:sts=4:sw=4:noexpandtab
