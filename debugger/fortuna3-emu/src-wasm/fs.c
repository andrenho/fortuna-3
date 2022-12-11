#include "fs.h"

#include <emscripten/emscripten.h>
#include <stdbool.h>
#include <stdlib.h>
#include <stdint.h>
#include <string.h>
#include <stdio.h>

#include "globals.h"
#include "fsfat/ff.h"

typedef enum { FS_FILE = 0, FS_DIR = 1 } FileType;

#define PAGE_SIZE 256

typedef struct {
    char     filename[11];
    uint32_t filesize;
    FileType filetype : 8;
} __attribute__((__packed__)) FFile;

static FATFS fs;

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

void fs_init()
{
    check_for_errors("f_mount", f_mount(&fs, "", 1));

    FIL fp;
    check_for_errors("f_open", f_open(&fp, "HELLO.TXT", FA_CREATE_NEW | FA_WRITE));

    const char* hello = "Hello world!";
    UINT bw;
    check_for_errors("f_write", f_write(&fp, hello, strlen(hello), &bw));
    // if (bw != strlen(hello)) abort();

    check_for_errors("f_close", f_close(&fp));
}

void copy_filename(char* dest, const char* src)
 {
    memset(dest, ' ', 11);

    size_t max = strlen(src);
    if (max > 11) max = 11;

    size_t j = 0;
    for (size_t i = 0; i < max; ++i) {
        if (src[i] == '.') {
            j = 8;
        } else if (src[i] == '\0') {
            return;
        } else {
            dest[j++] = src[i];
        }
    }
}

EMSCRIPTEN_KEEPALIVE ssize_t fs_dir(const char* dir_name, size_t n_records, void* buf)
{
    if (n_records == 0)
        return 0;

    FFile* ffile = (FFile *) buf;

    DIR dp;
    FILINFO fno;
    FRESULT fr = f_findfirst(&dp, &fno, dir_name, "*");
    if (fr != FR_OK)
        return -fr;
    long i = 0;

    while (fr == FR_OK && fno.fname[0] && i < n_records) {
        copy_filename(ffile[i].filename, fno.fname);
        ffile[i].filesize = (uint32_t) fno.fsize;
        ffile[i].filetype = (fno.fattrib & AM_DIR) ? FS_DIR : FS_FILE;

        fr = f_findnext(&dp, &fno);
        ++i;
    }

    if (fr != FR_OK)
        return -fr;

    f_closedir(&dp);

    return i;
}

EMSCRIPTEN_KEEPALIVE ssize_t fs_chdir_up(const char* dir_name, size_t sz, void* buf)
{
    return 0;
}

EMSCRIPTEN_KEEPALIVE ssize_t fs_file_page(const char* dir_name, const char* filename, size_t page, void* buf)
{
    ssize_t ret = 0;

    char path[strlen(dir_name) + strlen(filename) + 2];
    sprintf(path, "%s/%s", dir_name, filename);

    puts("1");
    printf(">> %s <<\n", filename);
    printf(">> %s <<\n", path);

    FIL fp;
    FRESULT fr = f_open(&fp, path, FA_READ);
    if (fr != FR_OK)
        return -fr;

    puts("2");

    if (page * PAGE_SIZE > f_size(&fp))  // return 0
        goto finish;

    puts("3");

    fr = f_lseek(&fp, page * PAGE_SIZE);
    if (fr != FR_OK) {
        ret = -fr;
        goto finish;
    }

    puts("4");

    UINT br;
    fr = f_read(&fp, buf, PAGE_SIZE, &br);
    if (fr != FR_OK) {
        ret = -fr;
        goto finish;
    }
    ret = br;

    puts("5");

finish:
    f_close(&fp);
    return ret;
}
