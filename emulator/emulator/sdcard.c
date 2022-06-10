#include "sdcard.h"

#include <stdbool.h>

long sd_size_mb;

PARTITION VolToPart[FF_VOLUMES] = {
	{0, 1},    /* "0:" ==> 1st partition in PD#0 */
};

// implement these externally
extern int sd_card_read(unsigned long start_at, unsigned int n_sectors, uint8_t* data);
extern int sd_card_write(unsigned long start_at, unsigned int n_sectors, const uint8_t* data);


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
	if (sd_card_read(sector, count, buff) == 0) {
		return RES_OK;
	}
	return RES_ERROR;
}

DRESULT disk_write (
  BYTE pdrv,        /* [IN] Physical drive number */
  const BYTE* buff, /* [IN] Pointer to the data to be written */
  LBA_t sector,     /* [IN] Sector number to write from */
  UINT count        /* [IN] Number of sectors to write */
)
{
	(void) pdrv;
	if (sd_card_write(sector, count, buff) == 0)
		return RES_OK;
	return RES_ERROR;
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
			((WORD*) buff)[0] = sd_size_mb / 1024 / 2;
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
