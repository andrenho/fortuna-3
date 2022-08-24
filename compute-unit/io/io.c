#include "io/io.h"

#include <avr/eeprom.h>
#include <stdio.h>

#include "dev/lcd.h"
#include "dev/ram.h"
#include "dev/rtc.h"
#include "dev/uart.h"
#include "io/ops.h"
#include "io/iolcd.h"
#include "io/iomemory.h"
#include "io/ioregs.h"
#include "io/random.h"
#include "io/serial.h"

static IO_Regs ioregs;

bool io_write(uint8_t addr, uint8_t data)
{
    if (addr <= 0xb) {
        ((uint8_t*) &ioregs)[addr] = data;
        return false;
    }

    switch (addr) {

        // serial

        case S_PUT:         putchar(data); break;

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

        // memory
        
        case MM_BANK_SET:   ram_set_bank(data & 7); break;

        // eeprom

        case EEPROM_SET:    eeprom_write_byte((uint8_t *) Pa(&ioregs), data);

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
            return true;
    }

    return false;
}

void io_write_bus(uint8_t addr, uint8_t data)
{
    switch (addr) {

        // serial
        
        case S_PRINT_Z:     io_serial_print_z(&ioregs); break;
        case S_PRINT_LEN:   io_serial_print_len(&ioregs); break;

        // LCD

        case LCD_LINE1:     io_lcd_print_line(0, Pa(&ioregs)); break;
        case LCD_LINE2:     io_lcd_print_line(1, Pa(&ioregs)); break;

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
    }
}

uint8_t io_read(uint8_t addr)
{
    if (addr <= 0xb) {
        return ((uint8_t*) &ioregs)[addr];
    }

    switch (addr) {
        
        // serial

        case S_GET:             return uart_getchar_nonblocking();
        case S_GET_BLK:         return getchar();

        // RTC

        case RTC_GET_YEAR:      return rtc_get().yy;
        case RTC_GET_MONTH:     return rtc_get().mm;
        case RTC_GET_DAY:       return rtc_get().dd;
        case RTC_GET_HOUR:      return rtc_get().hh;
        case RTC_GET_MINUTES:   return rtc_get().nn;
        case RTC_GET_SECONDS:   return rtc_get().ss;

        // random

        case RANDOM:            return set_R(&ioregs, random()) & 0xff;

        // memory

        case MM_BANK_GET:       return ram_bank() & 7;

        // math

        case SUM:               return P(&ioregs) + Q(&ioregs);
        case SUBTRACT:          return P(&ioregs) - Q(&ioregs);
        case MULTIPLY:          return P(&ioregs) * Q(&ioregs);
        case DIVIDE:            return P(&ioregs) / Q(&ioregs);
        case MODULO:            return P(&ioregs) % Q(&ioregs);

        // eeprom

        case EEPROM_GET:        return eeprom_read_byte((uint8_t *) Pa(&ioregs));
    }
    
    return 0;
}

// vim:ts=4:sts=4:sw=4:expandtab
