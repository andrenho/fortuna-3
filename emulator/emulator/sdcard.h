#ifndef SDCARD_H_
#define SDCARD_H_

#include "fatfs/ff.h"
#include "fatfs/diskio.h"

extern long sd_size_mb;

typedef DSTATUS (*SD_Status)(void);
extern SD_Status sd_status;

#endif
