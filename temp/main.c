#include <unistd.h>
#include <stdio.h>

#include "fsfat/ff.h"

FRESULT fresult(FRESULT r)
{
    switch (r) {
        case FR_OK: break;
        case FR_DISK_ERR: printf("<FR_DISK_ERR>\n"); break;
        case FR_INT_ERR: printf("<FR_INT_ERR>\n"); break;
        case FR_NOT_READY: printf("<FR_NOT_READY>\n"); break;
        case FR_NO_FILE: printf("<FR_NO_FILE>\n"); break;
        case FR_NO_PATH: printf("<FR_NO_PATH>\n"); break;
        case FR_INVALID_NAME: printf("<FR_INVALID_NAME>\n"); break;
        case FR_DENIED: printf("<FR_DENIED>\n"); break;
        case FR_EXIST: printf("<FR_EXIST>\n"); break;
        case FR_INVALID_OBJECT: printf("<FR_INVALID_OBJECT>\n"); break;
        case FR_WRITE_PROTECTED: printf("<FR_WRITE_PROTECTED>\n"); break;
        case FR_INVALID_DRIVE: printf("<FR_INVALID_DRIVE>\n"); break;
        case FR_NOT_ENABLED: printf("<FR_NOT_ENABLED>\n"); break;
        case FR_NO_FILESYSTEM: printf("<FR_NO_FILESYSTEM>\n"); break;
        case FR_MKFS_ABORTED: printf("<FR_MKFS_ABORTED>\n"); break;
        case FR_TIMEOUT: printf("<FR_TIMEOUT>\n"); break;
        case FR_LOCKED: printf("<FR_LOCKED>\n"); break;
        case FR_NOT_ENOUGH_CORE: printf("<FR_NOT_ENOUGH_CORE>\n"); break;
        case FR_TOO_MANY_OPEN_FILES: printf("<FR_TOO_MANY_OPEN_FILES>\n"); break;
        case FR_INVALID_PARAMETER: printf("<FR_INVALID_PARAMETER>\n"); break;
    }
    return r;
}

static FATFS fs;

extern FILE* f;

int main() 
{
    f = fopen("/tmp/image.img", "w+");
    if (!f)
        perror("fopen");
    printf("[Disk initialized.]\n");

    LBA_t plist[] = { 100, 0 };

    uint8_t buffer[FF_MAX_SS];
    printf("====== fdisk ======\n");
    FRESULT r = fresult(f_fdisk(0, plist, buffer));
    if (r != FR_OK)
        return 1;

    printf("====== mkfs ======\n");
    fresult(f_mkfs("0:", 0, buffer, sizeof buffer));

    printf("====== mount ======\n");
    fresult(f_mount(&fs, "0:", 0));

    fclose(f);
}

// vim:ts=4:sts=4:sw=4:expandtab
