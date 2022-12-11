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
    const char* hello = "Hello world!";
    UINT bw;
    check_for_errors("f_open", f_open(&fp, "HELLO.TXT", FA_CREATE_NEW | FA_WRITE));
    check_for_errors("f_write", f_write(&fp, hello, strlen(hello), &bw));
    check_for_errors("f_close", f_close(&fp));

    check_for_errors("f_mkdir", f_mkdir("/mydir"));
    check_for_errors("f_mkdir", f_mkdir("/mydir/secdir"));

    const char* text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eget magna fermentum iaculis eu non diam phasellus vestibulum. Tellus rutrum tellus pellentesque eu tincidunt tortor aliquam nulla. Pulvinar elementum integer enim neque volutpat ac tincidunt. Dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu. Neque ornare aenean euismod elementum nisi quis eleifend. Nec sagittis aliquam malesuada bibendum arcu vitae elementum curabitur. Vitae nunc sed velit dignissim sodales ut eu sem integer. Sagittis nisl rhoncus mattis rhoncus urna neque. At risus viverra adipiscing at in tellus integer feugiat. Egestas pretium aenean pharetra magna ac. Libero justo laoreet sit amet cursus sit. At volutpat diam ut venenatis tellus in metus. Orci phasellus egestas tellus rutrum.";
    check_for_errors("f_open", f_open(&fp, "/MYDIR/SECDIR/LOREM", FA_CREATE_NEW | FA_WRITE));
    check_for_errors("f_write", f_write(&fp, hello, strlen(text), &bw));
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

    memset(buf, 0, n_records * 0x10);

    FFile* ffile = (FFile *) buf;
    size_t i = 0;

    // add ".."
    if (dir_name[0] != '\0' && strcmp(dir_name, "/") != 0) {
        strcpy(ffile[i].filename, "..");
        ffile[i].filesize = 0;
        ffile[i].filetype = FS_DIR;
        ++i;
    }

    DIR dp;
    FILINFO fno;
    FRESULT fr = f_findfirst(&dp, &fno, dir_name, "*");
    if (fr != FR_OK)
        return -fr;

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

EMSCRIPTEN_KEEPALIVE ssize_t fs_file_page(const char* dir_name, const char* filename, size_t page, void* buf)
{
    ssize_t ret = 0;

    char path[strlen(dir_name) + strlen(filename) + 2];
    sprintf(path, "%s/%s", dir_name, filename);

    // printf("Read file page: >> %s <<\n", path);

    FIL fp;
    FRESULT fr = f_open(&fp, path, FA_READ);
    if (fr != FR_OK)
        return -fr;

    if (page * PAGE_SIZE > f_size(&fp))  // return 0
        goto finish;

    fr = f_lseek(&fp, page * PAGE_SIZE);
    if (fr != FR_OK) {
        ret = -fr;
        goto finish;
    }

    UINT br;
    fr = f_read(&fp, buf, PAGE_SIZE, &br);
    if (fr != FR_OK) {
        ret = -fr;
        goto finish;
    }
    ret = br;

finish:
    f_close(&fp);
    return ret;
}
