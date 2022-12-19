#ifndef TERMINAL_H_
#define TERMINAL_H_

#include <stddef.h>
#include <stdint.h>

#define MAX_PRINTED_CHARS 4096

void    terminal_printchar(uint8_t value);
size_t  terminal_unload_printed_chars(uint8_t* data, size_t max_sz);

uint8_t terminal_getchar();

#endif
