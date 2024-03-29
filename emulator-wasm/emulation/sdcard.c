#include <emscripten/emscripten.h>

#include "sdcard.h"

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "fsfat/ff.h"
#include "fsfat/diskio.h"

#include "fs.h"
#include "globals.h"

size_t sdcard_sz = 0;
uint8_t* sd_data = NULL;

static bool ejected = false;

PARTITION VolToPart[FF_VOLUMES] = {
        {0, 1},    /* "0:" ==> 1st partition in PD#0 */
};

static bool check_for_errors(const char* call, FRESULT result)
{
    switch (result) {
        case FR_OK:
            return true;
        case FR_INT_ERR:
            ERROR("%s: Assertion error", call)
        case FR_NOT_READY:
            ERROR("%s: Disk not ready", call)
        case FR_WRITE_PROTECTED:
            ERROR("%s: Disk is write protected", call)
        case FR_INVALID_PARAMETER:
            ERROR("%s: Invalid parameter", call)
        case FR_NOT_ENOUGH_CORE:
            ERROR("%s: Not enough core", call)
        case FR_INVALID_DRIVE:
            ERROR("%s: Invalid drive", call)
        case FR_MKFS_ABORTED:
            ERROR("%s: mkfs aborted", call)
        default:
            ERROR("%s: unexpected error (%d)", call, result)
    }
}

bool sdcard_init(size_t sz)
{
	free(sd_data);
	sdcard_set_ejected(false);

    sdcard_sz = sz;
    sd_data = malloc(sz);

    uint8_t buf[1024];
    LBA_t plist[] = { 100, 0 };
    if (!check_for_errors("fdisk", f_fdisk(0, plist, buf)))
        return false;

    MKFS_PARM parm = {
            .fmt = FM_ANY,
            .au_size = 0,
            .align = 0,
            .n_fat = 0,
            .n_root = 0,
    };
    if (!check_for_errors("mkfs", f_mkfs("0:", &parm, buf, sizeof buf)))
        return false;

    fs_init();

    return true;
}

void sdcard_copy_page(size_t page, uint8_t* data)
{
    memcpy(data, &sd_data[page*512], 512);
}

DSTATUS disk_status(BYTE pdrv)
{
    (void) pdrv;
    return ejected ? STA_NOINIT : 0;
}

DSTATUS disk_initialize(BYTE pdrv)
{
    (void) pdrv;
    return ejected ? STA_NOINIT : 0;
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
    return ejected ? RES_NOTRDY : RES_OK;
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
    return ejected ? RES_NOTRDY : RES_OK;
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
            ((LBA_t *) buff)[0] = sdcard_sz / FF_MAX_SS;
            break;
        case GET_BLOCK_SIZE:
            ((DWORD*) buff)[0] = 1;
            break;
    }
    return ejected ? RES_NOTRDY : RES_OK;
}

DWORD get_fattime (void)
{
    return 0;
}

EMSCRIPTEN_KEEPALIVE void sdcard_set_ejected(bool ejected_)
{
    ejected = ejected_;
}

// vim: ts=4:sts=4:sw=4:noexpandtab
