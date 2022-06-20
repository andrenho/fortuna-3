#include "sdcard.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "fatfs/ff.h"
#include "fatfs/diskio.h"

static size_t sdcard_sz;
static uint8_t* sd_data;

#define ERROR(...) { \
    snprintf(last_error, 0x200, __VA_ARGS__); \
    return false; \
}

PARTITION VolToPart[FF_VOLUMES] = {
        {0, 1},    /* "0:" ==> 1st partition in PD#0 */
};

bool sdcard_init(size_t sz, FatType fat_type, char last_error[0x200])
{
    sdcard_sz = sz;
    sd_data = malloc(sz);

    uint8_t buf[FF_MAX_SS];
    LBA_t plist[] = { 100, 0 };
    if (f_fdisk(0, plist, buf) != FR_OK)
        ERROR("fdisk ERROR");
    if (f_mkfs("", 0, buf, sizeof buf) != FR_OK)
        ERROR("mkfs ERROR");

    return true;
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
    memcpy(buff, &sd_data[sector * 512], count * 512);
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
    memcpy(&sd_data[sector * 512], buff, count * 512);
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
