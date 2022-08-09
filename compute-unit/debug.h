#ifndef DEBUG_H_
#define DEBUG_H_

#include <stdint.h>
#include <avr/pgmspace.h>

void debug_reset_reason(void);

void debug_lcd(uint8_t data);
void debug_mcu2rtc(uint8_t data);
void debug_rtc2mcu(uint8_t data);

void debug_spi_active(PGM_P dev);
void debug_spi_inactive(PGM_P dev);
void debug_spi_send(uint8_t sent, uint8_t recvd);

void print_P(PGM_P p);
void printbin(uint8_t value);
void printhex(uint8_t value);
void printhex16(uint16_t value);
void printhex32(uint32_t value);
void printdec(uint8_t value, size_t digits);

#endif

// vim:ts=4:sts=4:sw=4:expandtab
