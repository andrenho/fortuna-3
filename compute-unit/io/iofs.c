#include "iofs.h"

#include <avr/pgmspace.h>
#include <stdio.h>

#include "fsfat/ff.h"
#include "ansi.h"
#include "config.h"

static FATFS fs;

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
    r->Ra0 = fresult(f_mount(&fs, "", 1));
}


void io_fs_open_r(IO_Regs* r)
{
}


void io_fs_open_w(IO_Regs* r)
{
}


void io_fs_open_a(IO_Regs* r)
{
}


void io_fs_close(IO_Regs* r)
{
}


void io_fs_read(IO_Regs* r)
{
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
}



// vim:ts=4:sts=4:sw=4:expandtab
