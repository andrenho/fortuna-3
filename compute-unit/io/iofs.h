#ifndef IOFS_H_
#define IOFS_H_

#include <stdint.h>

#include "io/ioregs.h"

void io_fs_mount(IO_Regs* r);
void io_fs_open_r(IO_Regs* r);
void io_fs_open_w(IO_Regs* r);
void io_fs_open_a(IO_Regs* r);
void io_fs_close(IO_Regs* r, uint8_t data);
void io_fs_read(IO_Regs* r);
void io_fs_write(IO_Regs* r);
void io_fs_seek(IO_Regs* r);
void io_fs_size(IO_Regs* r);
void io_fs_stat(IO_Regs* r);
void io_fs_unlink(IO_Regs* r);
void io_fs_rename(IO_Regs* r);
void io_fs_chdir(IO_Regs* r);
void io_fs_mkdir(IO_Regs* r);
void io_fs_opendir(IO_Regs* r);
void io_fs_readdir(IO_Regs* r);
void io_fs_free(IO_Regs* r);
void io_fs_format(IO_Regs* r);

#endif

// vim:ts=4:sts=4:sw=4:expandtab
