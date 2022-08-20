#ifndef OPS_H_
#define OPS_H_

#define Pa0 0x00
#define Pa1 0x01
#define Pb0 0x02
#define Pb1 0x03
#define Qa0 0x04
#define Qa1 0x05
#define Qb0 0x06
#define Qb1 0x07
#define Ra0 0x08
#define Ra1 0x09
#define Rb0 0x0a
#define Rb1 0x0b

#define S_PUT 0x10
#define S_GET 0x10
#define S_GET_BLK 0x11

#define RTC_SET 0x12
#define RTC_GET_DATE 0x12
#define RTC_GET_TIME 0x13

#define LCD_LINE1 0x14
#define LCD_LINE2 0x15
#define LCD_CLEAR 0x16
#define LCD_CHAR 0x17
#define LCD_CMD 0x18

#define RANDOM 0x19

#define SD_READ 0x1A
#define SD_WRITE 0x1B

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

#define SUM 0x4A
#define SUBTRACT 0x4B
#define MULTIPLY 0x4C
#define DIVIDE 0x4D
#define MODULO 0x4E
#define COMPARE_16 0x4A
#define COMPARE_32 0x4B

#define TIMER0_SET 0x50
#define TIMER1_SET 0x51
#define TIMER0_GET 0x50
#define TIMER1_GET 0x51

#endif
