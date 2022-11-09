#include "io/io.h"

/*
#include "config.h"
#include "dev/lcd.h"
#include "dev/rtc.h"
#include "io/iofs.h"
#include "io/iolcd.h"
#include "io/random.h"
*/
#include "dev/ram.h"
#include "dev/uart.h"
#include "io/eeprom.h"
#include "io/ops.h"
#include "io/iomemory.h"
#include "io/ioregs.h"
#include "io/serial.h"

#include <stdio.h>

static IO_Regs ioregs;

bool io_write(uint8_t addr, uint8_t data)
{
    if (addr <= 0xb) {
        ((uint8_t*) &ioregs)[addr] = data;
        return false;
    }

    switch (addr) {

        // serial

        case S_PUT:         uart_printchar(data); break;

    /*
        // rtc

        case RTC_SET: 
            rtc_set((ClockDateTime) {
                .yy = ioregs.Pa0,
                .mm = ioregs.Pa1,
                .dd = ioregs.Pb0,
                .hh = ioregs.Pb1,
                .nn = ioregs.Qa0,
                .ss = ioregs.Qa1,
            });
            break;

        // lcd

        case LCD_CLEAR:     lcd_clear(); break;
        case LCD_CHAR:      lcd_print_char(data); break;
        case LCD_CMD:       lcd_command(data); break;
        */

        // memory
        
        case MM_BANK_SET:   ram_set_bank(data); break;

        // eeprom

        case EEPROM_SET:    eeprom_write(Pa(&ioregs), data); break;

        /*
		// sdcard

#if INCLUDE_SDCARD
        case FS_MOUNT:      io_fs_mount(&ioregs); break;
        case FS_CLOSE:      io_fs_close(&ioregs, data); break;
        case FS_SIZE:       io_fs_size(&ioregs); break;
        case FS_CLOSEDIR:   io_fs_closedir(&ioregs, data); break;
        case FS_FREE:       io_fs_free(&ioregs); break;
        case FS_FORMAT:     io_fs_format(&ioregs); break;
#endif

        // operations that require the control of the bus

        case S_PRINT_Z:
        case S_PRINT_LEN:
        case LCD_LINE1:
        case LCD_LINE2:
        case MM_CPY:
        case MM_CPY_FAR:
        case MM_STRCPY:
        case MM_STRCPY_FAR:
        case MM_STRLEN:
        case MM_STRCMP:
        case MM_STRSUB:
        case MM_STRCHR:
        case MM_SET:
        case MM_TO_DEC:
        case MM_TO_HEX:
        case FS_OPEN_R:
        case FS_OPEN_W:
        case FS_OPEN_A:
        case FS_READ:
        case FS_WRITE:
        case FS_SEEK:
        case FS_STAT:
        case FS_UNLINK:
        case FS_RENAME:
        case FS_CHDIR:
        case FS_MKDIR:
        case FS_OPENDIR:
        case FS_READDIR:
            return true;
    */
    }

    return false;
}

void io_write_bus(uint8_t addr, uint8_t data)
{
    switch (addr) {

        // serial
        
        case S_PRINT_Z:     io_serial_print_z(&ioregs); break;
        case S_PRINT_LEN:   io_serial_print_len(&ioregs); break;

    /*
        // LCD

        case LCD_LINE1:     io_lcd_print_line(0, Pa(&ioregs)); break;
        case LCD_LINE2:     io_lcd_print_line(1, Pa(&ioregs)); break;

    */
        // memory

        case MM_CPY: 		io_mm_cpy(&ioregs); break;
        case MM_CPY_FAR: 	io_mm_cpy_far(&ioregs); break;
        case MM_STRCPY: 	io_mm_strcpy(&ioregs); break;
        case MM_STRCPY_FAR: io_mm_strcpy_far(&ioregs); break;
        case MM_STRLEN: 	io_mm_strlen(&ioregs); break;
        case MM_STRCMP: 	io_mm_strcmp(&ioregs); break;
        case MM_STRSUB: 	io_mm_strsub(&ioregs); break;
        case MM_STRCHR: 	io_mm_strchr(&ioregs, data); break;
        case MM_SET: 		io_mm_set(&ioregs, data); break;
        case MM_TO_DEC: 	io_mm_to_dec(&ioregs); break;
        case MM_TO_HEX: 	io_mm_to_hex(&ioregs, data); break;

    /*
		// sdcard

#if INCLUDE_SDCARD
        case FS_OPEN_R:     io_fs_open_r(&ioregs); break;
        case FS_OPEN_W:     io_fs_open_w(&ioregs); break;
        case FS_OPEN_A:     io_fs_open_a(&ioregs); break;
        case FS_READ:       io_fs_read(&ioregs); break;
        case FS_WRITE:      io_fs_write(&ioregs); break;
        case FS_SEEK:       io_fs_seek(&ioregs); break;
        case FS_SIZE:       io_fs_size(&ioregs); break;
        case FS_STAT:       io_fs_stat(&ioregs); break;
        case FS_UNLINK:     io_fs_unlink(&ioregs); break;
        case FS_RENAME:     io_fs_rename(&ioregs); break;
        case FS_CHDIR:      io_fs_chdir(&ioregs); break;
        case FS_MKDIR:      io_fs_mkdir(&ioregs); break;
        case FS_OPENDIR:    io_fs_opendir(&ioregs); break;
        case FS_READDIR:    io_fs_readdir(&ioregs); break;
#endif

    */
    }
}

uint8_t io_read(uint8_t addr)
{
    if (addr <= 0xb)
        return ((uint8_t*) &ioregs)[addr];

    switch (addr) {
        
        // serial

        case S_GET:             return uart_getchar_nonblocking();
        case S_GET_BLK:         return uart_getchar_blocking();

        /*
        // RTC

        case RTC_GET_YEAR:      return rtc_get().yy;
        case RTC_GET_MONTH:     return rtc_get().mm;
        case RTC_GET_DAY:       return rtc_get().dd;
        case RTC_GET_HOUR:      return rtc_get().hh;
        case RTC_GET_MINUTES:   return rtc_get().nn;
        case RTC_GET_SECONDS:   return rtc_get().ss;

        // random

        case RANDOM:            return set_R(&ioregs, random()) & 0xff;
        */

        // memory

        case MM_BANK_GET:       return ram_bank() & 7;

        // math

        case SUM:               return set_R(&ioregs, P(&ioregs) + Q(&ioregs));
        case SUBTRACT:          return set_R(&ioregs, P(&ioregs) - Q(&ioregs));
        case MULTIPLY:          return set_R(&ioregs, P(&ioregs) * Q(&ioregs));
        case DIVIDE:            return set_R(&ioregs, P(&ioregs) / Q(&ioregs));
        case MODULO:            return set_R(&ioregs, P(&ioregs) % Q(&ioregs));

        // eeprom

        case EEPROM_GET:        return eeprom_read(Pa(&ioregs));
    }
    
    return 0;
}

// vim:ts=4:sts=4:sw=4:expandtab
