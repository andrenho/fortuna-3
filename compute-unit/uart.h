#ifndef UART_H_
#define UART_H_

#include <stdint.h>

#define RED "\e[0;31m"
#define GRN "\e[1;32m"
#define RST "\e[0m"

void uart_init(void);
void uart_badisr(void);

#endif
