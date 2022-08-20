#ifndef UART_H_
#define UART_H_

#include <stdint.h>

void uart_init(void);
void uart_badisr(void);

uint8_t uart_getchar_nonblocking(void);

#endif
