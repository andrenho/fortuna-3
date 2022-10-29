#include "uart.h"

#include "terminal.h"

void uart_init(void)
{
}

void uart_badisr(void)
{
}

void uart_printchar(uint8_t c)
{
    terminal_printchar(c);
}

uint8_t uart_getchar_nonblocking(void)
{
    return 0;  // TODO
}

uint8_t uart_getchar_blocking()
{
    return 0;  // TODO
}