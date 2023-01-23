#ifndef INTERFACE_H_
#define INTERFACE_H_

#include <stdint.h>

void    interface_init();
void    interface_uart_write(uint8_t c);
uint8_t interface_uart_read();
void    interface_run_thread();
void    interface_destroy();

#endif