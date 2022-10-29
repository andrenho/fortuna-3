#ifndef UART_H_
#define UART_H_

#include <stdint.h>

void uart_init(void);
void uart_badisr(void);

void uart_printchar(uint8_t c);

uint8_t uart_getchar_nonblocking(void);
uint8_t uart_getchar_blocking();

#endif
