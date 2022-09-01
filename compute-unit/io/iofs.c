#include "iofs.h"

#include <avr/pgmspace.h>
#include <stdio.h>

#include "fsfat/ff.h"
#include "ansi.h"
#include "config.h"
#include "dev/ram.h"

#define MAX_FP 4

#define max(a,b)             \
({                           \
    __typeof__ (a) _a = (a); \
    __typeof__ (b) _b = (b); \
    _a > _b ? _a : _b;       \
})

#define min(a,b)             \
({                           \
    __typeof__ (a) _a = (a); \
    __typeof__ (b) _b = (b); \
    _a < _b ? _a : _b;       \
})

static FATFS fs;
static FIL files[MAX_FP];

FRESULT fresult(FRESULT r)
{
#if DEBUG_SDCARD
    switch (r) {
        case FR_OK: break;
        case FR_DISK_ERR: printf_P(PSTR(RED "<FR_DISK_ERR>" RST)); break;
        case FR_INT_ERR: printf_P(PSTR(RED "<FR_INT_ERR>" RST)); break;
        case FR_NOT_READY: printf_P(PSTR(RED "<FR_NOT_READY>" RST)); break;
        case FR_NO_FILE: printf_P(PSTR(RED "<FR_NO_FILE>" RST)); break;
        case FR_NO_PATH: printf_P(PSTR(RED "<FR_NO_PATH>" RST)); break;
        case FR_INVALID_NAME: printf_P(PSTR(RED "<FR_INVALID_NAME>" RST)); break;
        case FR_DENIED: printf_P(PSTR(RED "<FR_DENIED>" RST)); break;
        case FR_EXIST: printf_P(PSTR(RED "<FR_EXIST>" RST)); break;
        case FR_INVALID_OBJECT: printf_P(PSTR(RED "<FR_INVALID_OBJECT>" RST)); break;
        case FR_WRITE_PROTECTED: printf_P(PSTR(RED "<FR_WRITE_PROTECTED>" RST)); break;
        case FR_INVALID_DRIVE: printf_P(PSTR(RED "<FR_INVALID_DRIVE>" RST)); break;
        case FR_NOT_ENABLED: printf_P(PSTR(RED "<FR_NOT_ENABLED>" RST)); break;
        case FR_NO_FILESYSTEM: printf_P(PSTR(RED "<FR_NO_FILESYSTEM>" RST)); break;
        case FR_MKFS_ABORTED: printf_P(PSTR(RED "<FR_MKFS_ABORTED>" RST)); break;
        case FR_TIMEOUT: printf_P(PSTR(RED "<FR_TIMEOUT>" RST)); break;
        case FR_LOCKED: printf_P(PSTR(RED "<FR_LOCKED>" RST)); break;
        case FR_NOT_ENOUGH_CORE: printf_P(PSTR(RED "<FR_NOT_ENOUGH_CORE>" RST)); break;
        case FR_TOO_MANY_OPEN_FILES: printf_P(PSTR(RED "<FR_TOO_MANY_OPEN_FILES>" RST)); break;
        case FR_INVALID_PARAMETER: printf_P(PSTR(RED "<FR_INVALID_PARAMETER>" RST)); break;
    }
#endif
    return r;
}

void io_fs_mount(IO_Regs* r)
{
    r->Ra0 = fresult(f_mount(&fs, "0:", 1));
}


void io_fs_open_r(IO_Regs* r)
{
    uint8_t filename[255];
    ram_get_string(Qa(r), filename, sizeof filename);
    r->Ra0 = fresult(f_open(&files[r->Pa0 % MAX_FP], (const char *) filename, FA_READ));
}


void io_fs_open_w(IO_Regs* r)
{
    uint8_t filename[255];
    ram_get_string(Qa(r), filename, sizeof filename);
    r->Ra0 = fresult(f_open(&files[r->Pa0 % MAX_FP], (const char *) filename, FA_WRITE | FA_CREATE_NEW));
}


void io_fs_open_a(IO_Regs* r)
{
    uint8_t filename[255];
    ram_get_string(Qa(r), filename, sizeof filename);
    r->Ra0 = fresult(f_open(&files[r->Pa0 % MAX_FP], (const char *) filename, FA_WRITE | FA_OPEN_APPEND));
}


void io_fs_close(IO_Regs* r, uint8_t data)
{
    fresult(f_close(&files[data]));
}


void io_fs_read(IO_Regs* r)
{
    FIL* fil = &files[r->Pa0 % MAX_FP];
    uint8_t buff[512];
    UINT n_bytes = min((uint16_t) 512, Pa(r));
	UINT bytes_read;

    r->Ra0 = fresult(f_read(fil, buff, n_bytes, &bytes_read));
    set_Rb(r, bytes_read);

    uint8_t original_bank = ram_bank();
    ram_set_bank(r->Qb0);
    ram_write_array(Qa(r), buff, bytes_read);
    ram_set_bank(original_bank);
}


void io_fs_write(IO_Regs* r)
{
}


void io_fs_seek(IO_Regs* r)
{
}


void io_fs_size(IO_Regs* r)
{
}


void io_fs_stat(IO_Regs* r)
{
}


void io_fs_unlink(IO_Regs* r)
{
}


void io_fs_rename(IO_Regs* r)
{
}


void io_fs_chdir(IO_Regs* r)
{
}


void io_fs_mkdir(IO_Regs* r)
{
}


void io_fs_opendir(IO_Regs* r)
{
}


void io_fs_readdir(IO_Regs* r)
{
}


void io_fs_free(IO_Regs* r)
{
}


void io_fs_format(IO_Regs* r)
{
    LBA_t plist[] = { 100, 0 };

    uint8_t buffer[FF_MAX_SS];
    r->Ra0 = fresult(f_fdisk(0, plist, buffer));
    if (r->Ra0 != FR_OK)
        return;

    r->Ra0 = fresult(f_mkfs("0:", 0, buffer, sizeof buffer));
}


// vim:ts=4:sts=4:sw=4:expandtab
