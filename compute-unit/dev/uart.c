#include "dev/uart.h"

#include <stdio.h>

#include <avr/interrupt.h>
#include <avr/io.h>
#include <avr/pgmspace.h>
#include <util/delay.h>
#include <util/setbaud.h>

static uint8_t latest_char = 0;
static bool remote = false;

static void char_sent(unsigned char c)
{
    // if (latest_char == 0xfe && udr == 0xf0) {
    if (latest_char == 'B' && c == 'A') {
        remote = true;
    }
    latest_char = c;
}

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
    (void) f;

    loop_until_bit_is_set(UCSR0A, RXC0);
    unsigned char c = UDR0;
    char_sent(c);
    return c;
}

void uart_printchar(uint8_t c)
{
    putchar(c);
}

uint8_t uart_getchar_blocking(void)
{
    return getchar();
}

uint8_t uart_getchar_nonblocking(void)
{
    unsigned char c = UDR0;
    if (c != 0)
        char_sent(c);
    return c;
}

void uart_init(void)
{
    cli();

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

    sei();

    static FILE uart = FDEV_SETUP_STREAM(uart_putchar, uart_getchar, _FDEV_SETUP_RW);
    stdin = stdout = &uart;

    _delay_ms(100);
}

void uart_badisr(void)
{
    puts_P(PSTR("BADISR"));
    for(;;) ;
}

bool uart_entered_remote(void)
{
    bool r = remote;
    remote = false;
    return r;
}

ISR(USART0_RX_vect)
{
    char_sent(UDR0);
}

// vim:ts=4:sts=4:sw=4:expandtab
