#include "sdcard.h"

#include <string.h>
#include <stdlib.h>

#include "fatfs/ff.h"
#include "fatfs/diskio.h"

static size_t sdcard_sz;
static uint8_t* sd_data;

void sdcard_init(size_t sz)
{
    sdcard_sz = sz;
    sd_data = malloc(sz);
}

void sdcard_copy_page(size_t page, uint8_t* data)
{
    memcpy(data, &sd_data[page*512], 512);
}

DSTATUS disk_status(BYTE pdrv)
{
	(void) pdrv;
	return 0;
}

DSTATUS disk_initialize(BYTE pdrv)
{
	(void) pdrv;
	return 0;
}

DRESULT disk_read (
  BYTE pdrv,     /* [IN] Physical drive number */
  BYTE* buff,    /* [OUT] Pointer to the read data buffer */
  LBA_t sector,  /* [IN] Start sector number */
  UINT count     /* [IN] Number of sectros to read */
)
{
	(void) pdrv;
	// TODO - add callback
	return RES_OK;
}

DRESULT disk_write (
  BYTE pdrv,        /* [IN] Physical drive number */
  const BYTE* buff, /* [IN] Pointer to the data to be written */
  LBA_t sector,     /* [IN] Sector number to write from */
  UINT count        /* [IN] Number of sectors to write */
)
{
	(void) pdrv;
	return RES_OK;
}

DRESULT disk_ioctl (
  BYTE pdrv,     /* [IN] Drive number */
  BYTE cmd,      /* [IN] Control command code */
  void* buff     /* [I/O] Parameter and data buffer */
)
{
	(void) pdrv;
	switch (cmd) {
		case CTRL_SYNC:
			break;
		case GET_SECTOR_COUNT:
			((WORD*) buff)[0] = sdcard_sz / 512;
			break;
		case GET_BLOCK_SIZE:
			((DWORD*) buff)[0] = 1;
			break;
	}
	return RES_OK;
}

DWORD get_fattime (void)
{
	return 0;
}

// vim: ts=4:sts=4:sw=4:noexpandtab
