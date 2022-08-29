#include "fsfat/ff.h"			/* Obtains integer types */
#include "fsfat/diskio.h"		/* Declarations of disk functions */

#include <stdio.h>

static FILE* f = NULL;

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
    return FR_OK;
}



/*-----------------------------------------------------------------------*/
/* Initialize a Drive                                                    */
/*-----------------------------------------------------------------------*/

DSTATUS disk_initialize (
	BYTE pdrv				/* Physical drive nmuber to identify the drive */
)
{
    (void) pdrv;
    f = fopen("/tmp/image.img", "a+b");
    if (!f)
        perror("fopen");
    printf("[Disk initialized.]\n");
    return FR_OK;
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

    if (fseek(f, sector * 512, SEEK_SET) != 0)
        perror("fseek");

    if (fread(buff, 512, count, f) != count)
        perror("fwrite");

    printf("[Sector %d (size %d) read.]\n", sector, count);

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
    
    if (fseek(f, sector * 512, SEEK_SET) != 0)
        perror("fseek");

    if (fwrite(buff, 512, count, f) != count)
        perror("fwrite");

    printf("[Sector %d (size %d) written.]\n", sector, count);

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
            sz = 24 * 1024;  // 8 MB - TODO
            *(LBA_t *) buff = sz;
            printf("Got sector count of %d.\n", sz);
            break;
        case GET_BLOCK_SIZE:
            *(WORD *) buff = 512;
            printf("Got erase block size of 512.\n");
            break;
        default: 
            printf("Invalid parameter %d.\n", cmd);
            return RES_PARERR;
    }
    return RES_OK;
}

void finalize()
{
    fclose(f);
}

// vim:ts=4:sts=4:sw=4:expandtab
