#include "fs.h"

#include <emscripten/emscripten.h>
#include <stdint.h>
#include <string.h>

typedef enum { FS_FILE = 0, FS_DIR = 1 } FileType;

typedef struct {
    char     filename[11];
    uint32_t filesize;
    FileType filetype : 8;
} __attribute__((__packed__)) FFile;

EMSCRIPTEN_KEEPALIVE size_t fs_dir(const char* dir_name, size_t n_records, void* buf)
{
    FFile* ffile = (FFile *) buf;

    strcpy(ffile[0].filename, "BOOT    BIN");
    ffile[0].filesize = 1;
    ffile[0].filetype = FS_FILE;

    return 256;
}

EMSCRIPTEN_KEEPALIVE size_t fs_chdir_up(const char* dir_name, size_t sz, void* buf)
{
    return 0;
}

EMSCRIPTEN_KEEPALIVE size_t fs_file_page(const char* dir_name, const char* filename, size_t page, void* buf)
{
    for (size_t i = 0; i < 256; ++i)
        ((uint8_t *) buf)[i] = i;
    return 256;
}
