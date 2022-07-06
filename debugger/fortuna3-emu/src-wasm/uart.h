#ifndef UART_H_
#define UART_H_

#include <stddef.h>
#include <stdint.h>

#define MAX_PRINTED_CHARS 4096

void    uart_printchar(uint8_t value);
size_t  uart_unload_printed_chars(uint8_t* data, size_t max_sz);

uint8_t uart_getchar();

#endif
