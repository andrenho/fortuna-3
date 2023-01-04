#include "dev/uart.h"

#include <stdio.h>

#include <avr/io.h>
#include <avr/interrupt.h>
#include <avr/pgmspace.h>
#include <util/delay.h>
#include <util/setbaud.h>

#define KEY_QUEUE_SZ 16

static uint8_t key_queue[KEY_QUEUE_SZ] = { 0 };
static uint8_t key_queue_idx = 0;

static int uart_putchar(char c, FILE* f)
{
    (void) f;

    if (c == '\n')
        uart_putchar('\r', f);
    loop_until_bit_is_set(UCSR0A, UDRE0);
    UDR0 = c;
    return 0;
}

static int uart_getchar(FILE* f)
{
    if (key_queue_idx == 0)
        return 0;
    return key_queue[--key_queue_idx];
}

void uart_printchar(uint8_t c)
{
    putchar(c);
}

uint8_t uart_getchar_blocking(void)
{
    for (;;); // TODO
    return 0;
}

uint8_t uart_getchar_nonblocking(void)
{
    if (key_queue_idx == 0)
        return 0;
    return key_queue[--key_queue_idx];
}

void uart_init(void)
{
    // set speed
    UBRR0H = UBRRH_VALUE;
    UBRR0L = UBRRL_VALUE;

    // set config
    UCSR0C = (1<<UCSZ01) | (1<<UCSZ00);   // Async-mode 
    UCSR0B = (1 << RXEN0) | (1<<TXEN0) | (1<<RXCIE0);   // Enable Receiver (+ interrupt) and Transmitter

#if USE_2X
    UCSR0A |= (1 << U2X0);
#else
    UCSR0A &= ~(1 << U2X0);
#endif

    static FILE uart = FDEV_SETUP_STREAM(uart_putchar, uart_getchar, _FDEV_SETUP_RW);
    stdin = stdout = &uart;

    _delay_ms(100);
}

void uart_badisr(void)
{
    puts_P(PSTR("BADISR"));
    for(;;) ;
}

ISR(USART0_RX_vect)
{
    if (key_queue_idx >= KEY_QUEUE_SZ)
        return;
    key_queue[key_queue_idx++] = UDR0;
}

// vim:ts=4:sts=4:sw=4:expandtab
