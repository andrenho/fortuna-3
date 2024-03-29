#include "fsfat/ff.h"			/* Obtains integer types */
#include "fsfat/diskio.h"		/* Declarations of disk functions */

#include "config.h"
#include "dev/sdcard.h"

PARTITION VolToPart[FF_VOLUMES] = {
    {0, 1},    /* "0:" ==> 1st partition in PD#0 */
};

/*-----------------------------------------------------------------------*/
/* Get Drive Status                                                      */
/*-----------------------------------------------------------------------*/

DSTATUS disk_status (
	BYTE pdrv		/* Physical drive nmuber to identify the drive */
)
{
    (void) pdrv;
    if (sdcard_was_initialized())
        return 0;
    else
        return STA_NOINIT;
}



/*-----------------------------------------------------------------------*/
/* Inidialize a Drive                                                    */
/*-----------------------------------------------------------------------*/

DSTATUS disk_initialize (
	BYTE pdrv				/* Physical drive nmuber to identify the drive */
)
{
    return disk_status(pdrv);  // we assume the disk was already initialized
}



/*-----------------------------------------------------------------------*/
/* Read Sector(s)                                                        */
/*-----------------------------------------------------------------------*/

DRESULT disk_read (
	BYTE pdrv,		/* Physical drive nmuber to identify the drive */
	BYTE *buff,		/* Data buffer to store read data */
	LBA_t sector,	/* Start sector in LBA */
	UINT count		/* Number of sectors to read */
)
{
    (void) pdrv;
    for (LBA_t i = sector; i < (sector + count); ++i)
        if (!sdcard_read_block(i, buff))
            return RES_ERROR;
    return RES_OK;
}



/*-----------------------------------------------------------------------*/
/* Write Sector(s)                                                       */
/*-----------------------------------------------------------------------*/

#if FF_FS_READONLY == 0

DRESULT disk_write (
	BYTE pdrv,			/* Physical drive nmuber to identify the drive */
	const BYTE *buff,	/* Data to be written */
	LBA_t sector,		/* Start sector in LBA */
	UINT count			/* Number of sectors to write */
)
{
    (void) pdrv;
    for (LBA_t i = sector; i < (sector + count); ++i)
        if (!sdcard_write_block(i, buff))
            return RES_ERROR;
    return RES_OK;
}

#endif


/*-----------------------------------------------------------------------*/
/* Miscellaneous Functions                                               */
/*-----------------------------------------------------------------------*/

DRESULT disk_ioctl (
	BYTE pdrv,		/* Physical drive nmuber (0..) */
	BYTE cmd,		/* Control code */
	void *buff		/* Buffer to send/receive control data */
)
{
    (void) pdrv;
    LBA_t sz;

    switch (cmd) {
        case CTRL_SYNC:
            break;
        case GET_SECTOR_COUNT:
            sz = (LBA_t) PARTITION_0_SIZE_IN_MB * (LBA_t) 2048;
            *(LBA_t *) buff = sz;
            break;
        case GET_BLOCK_SIZE:
            *(WORD *) buff = 512;
            break;
        default: 
            return RES_PARERR;
    }
    return RES_OK;
}

// vim:ts=4:sts=4:sw=4:expandtab
