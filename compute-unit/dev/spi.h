#ifndef SPI_H_
#define SPI_H_

#include <stdint.h>

void spi_init(void);

uint8_t spi_send(uint8_t byte);
uint8_t spi_recv(void);
uint8_t spi_recv_ignore_ff(void);

#endif

// vim:ts=4:sts=4:sw=4:expandtab
