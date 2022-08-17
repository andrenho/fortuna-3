#ifndef FS_H_
#define FS_H_

#include <stdbool.h>
#include <stddef.h>
#include <stdint.h>

#include "fsfat/ff.h"

FRESULT fs_format(void);

FRESULT fs_mount(void);

#endif

// vim:ts=4:sts=4:sw=4:expandtab
