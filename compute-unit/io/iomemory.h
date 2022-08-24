#ifndef IOMEMORY_H_
#define IOMEMORY_H_

#include "io/ioregs.h"

void io_mm_cpy(IO_Regs* r);
void io_mm_cpy_far(IO_Regs* r);
void io_mm_strcpy(IO_Regs* r);
void io_mm_strcpy_far(IO_Regs* r);
void io_mm_strlen(IO_Regs* r);
void io_mm_strcmp(IO_Regs* r);
void io_mm_strsub(IO_Regs* r);
void io_mm_strchr(IO_Regs* r, uint8_t data);
void io_mm_set(IO_Regs* r, uint8_t data);
void io_mm_to_dec(IO_Regs* r);
void io_mm_to_hex(IO_Regs* r, uint8_t data);

#endif

// vim:ts=4:sts=4:sw=4:expandtab
