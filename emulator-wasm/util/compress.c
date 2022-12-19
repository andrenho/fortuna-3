#include <emscripten/emscripten.h>

#include "compress.h"

#include <stdbool.h>

#include "globals.h"
#include "miniz/miniz.h"

EMSCRIPTEN_KEEPALIVE long compress_sdcard(uint8_t* data, unsigned long data_len)
{
    mz_zip_archive zip;
    mz_zip_zero_struct(&zip);

    if (mz_zip_writer_init_heap(&zip, 0, 128 * 1024) == false)
        ERROR("Error initializing zipper.");
    if (mz_zip_writer_add_mem(&zip, "image.img", sd_data, sdcard_sz, MZ_BEST_COMPRESSION) == false)
        ERROR("Error adding file to archive.");

    void *buf;
    size_t sz;
    if (mz_zip_writer_finalize_heap_archive(&zip, &buf, &sz) == false)
        ERROR("Error adding file to archive.");

    if (sz > data_len)
        ERROR("Not enough space in memory to create zip.");

    memcpy(data, buf, sz);

    mz_zip_writer_end(&zip);

    return sz;
}
