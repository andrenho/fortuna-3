#ifndef OPS_H_
#define OPS_H_

#define S_PUT 0x10
#define S_GET 0x10
#define S_GET_BLK 0x11
#define S_PRINT_Z 0x11
#define S_PRINT_LEN 0x12

#define RTC_SET 0x15
#define RTC_GET_DATE 0x16
#define RTC_GET_TIME 0x17

#define LCD_LINE1 0x18
#define LCD_LINE2 0x19
#define LCD_CLEAR 0x1A
#define LCD_CHAR 0x1B
#define LCD_CMD 0x1C

#define RANDOM 0x1D

#define SD_READ 0x1E
#define SD_WRITE 0x1F

#define FS_MOUNT 0x20
#define FS_OPEN_R 0x21
#define FS_OPEN_W 0x22
#define FS_OPEN_A 0x23
#define FS_CLOSE 0x20
#define FS_READ 0x24
#define FS_WRITE 0x25
#define FS_SEEK 0x26
#define FS_SIZE 0x27
#define FS_STAT 0x28
#define FS_UNLINK 0x28
#define FS_RENAME 0x29
#define FS_CHDIR 0x2A
#define FS_MKDIR 0x2B
#define FS_OPENDIR 0x2C
#define FS_READDIR 0x2D
#define FS_FREE 0x2E
#define FS_FORMAT 0x2F

#define MM_BANK 0x40
#define MM_CPY 0x41
#define MM_CPY_FAR 0x42
#define MM_STRCPY 0x43
#define MM_STRCPY_FAR 0x44
#define MM_STRLEN 0x40
#define MM_STRCMP 0x41
#define MM_STRSUB 0x42
#define MM_STRCHR 0x43
#define MM_SET 0x45
#define MM_TO_DEC 0x46
#define MM_TO_HEX 0x47
#define MM_TO_BIN 0x48

#define SUM 0x50
#define SUBTRACT 0x51
#define MULTIPLY 0x52
#define DIVIDE 0x53
#define MODULO 0x54
#define COMPARE_16 0x55
#define COMPARE_32 0x56

#define TIMER0_SET 0x60
#define TIMER1_SET 0x61
#define TIMER0_GET 0x62
#define TIMER1_GET 0x63

#endif
