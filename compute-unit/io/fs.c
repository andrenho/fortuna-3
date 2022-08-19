#include "fs.h"

#include <stdio.h>

#include "fsfat/ff.h"

static FATFS fs;

#ifdef DEBUG_FS_ERRORS
#  include "debug.h"
#  include "uart.h"
#  define FS_CHECK(r) { if (fs_check(r) != FR_OK) return r; }

  static FRESULT fs_check(FRESULT r) {
      if (r != FR_OK)
          print_P(PSTR(RED));
      switch (r) {
          case FR_OK: break;
          case FR_DISK_ERR: print_P(PSTR("DISK_ERR")); break;
          case FR_NOT_ENABLED: print_P(PSTR("NOT_ENABLED")); break;
          case FR_NO_FILESYSTEM: print_P(PSTR("NO_FILESYSTEM")); break;
          case FR_NOT_READY: print_P(PSTR("NOT_READY")); break;
          case FR_INVALID_PARAMETER: print_P(PSTR("INVALID_PARAMETER")); break;
          case FR_NOT_ENOUGH_CORE: print_P(PSTR("NOT_ENOUGH_CORE")); break;
          case FR_INVALID_DRIVE: print_P(PSTR("INVALID_DRIVE")); break;
          case FR_MKFS_ABORTED: print_P(PSTR("MKFS_ABORTED")); break;
          default: print_P(PSTR("UNEXPECTED_ERROR")); break;
      }
      if (r != FR_OK)
          puts_P(PSTR(RST));
      return r;
  }
#else
#  define FS_CHECK(r) { if ((r) != FR_OK) return r; }
#endif

FRESULT fs_format(void)
{
    BYTE work[FF_MAX_SS];
    LBA_t plist[] = { 100, 0 };
    FS_CHECK(f_fdisk(0, plist, work))
    MKFS_PARM fmt_opt = {FM_ANY, 0, 0, 0, 0};
    FS_CHECK(f_mkfs("0:", &fmt_opt, work, sizeof work))
    return true;
}

FRESULT fs_mount(void)
{
    FS_CHECK(f_mount(&fs, "0:", 1))
    return true;
}

// vim:ts=4:sts=4:sw=4:expandtab
