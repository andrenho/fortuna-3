#include "interface.h"

#include "../events.h"

void interface_init()
{
}

void interface_uart_write(uint8_t c)
{
    // TODO
}

void interface_uart_read()
{
}

void interface_run_thread()
{
}

void interface_reset()
{
}

void interface_destroy()
{
}

void interface_received_char(uint8_t c)
{
    events_push(E_TEXT_PRINT, (void*)(intptr_t) c);
}