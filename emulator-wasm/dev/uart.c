#include "uart.h"

#include "globals.h"
#include "emulation/terminal.h"

extern void interface_received_char(uint8_t c);

void uart_init(void)
{
}

void uart_badisr(void)
{
}

void uart_printchar(uint8_t c)
{
    terminal_printchar(c);
    interface_received_char(c);
}

uint8_t uart_getchar_nonblocking(void)
{
    uint8_t v = uart_last_keypress;
    uart_last_keypress = 0;
    return v;
}

uint8_t uart_getchar_blocking()
{
    // TODO - blocking?
    return uart_getchar_nonblocking();
}