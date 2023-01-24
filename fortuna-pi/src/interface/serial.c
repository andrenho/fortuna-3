#include "interface.h"
#include "../events.h"

#include <errno.h>
#include <fcntl.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <termios.h>
#include <unistd.h>

static int fd = 0;
static pthread_t thread;

static void error_message(const char* msg)
{
    char* buffer = malloc(strlen(msg) + 20);
    sprintf(buffer, "\e[1;31m%s\e[0m", msg);

    for (const char *s = buffer; *s; ++s)
        events_push(E_TEXT_PRINT, (void *) (intptr_t) *s);
}

void interface_init()
{
    fd = open(SERIAL, O_RDWR | O_NOCTTY | O_NDELAY);
    if (fd < 0) {
        error_message("Error opening serial port: ");
        error_message(strerror(errno));
        return;  // TODO
    }
    printf("Serial port initialized.\n");

    fcntl(fd, F_SETFL, 0);

    struct termios options;
    if (tcgetattr (fd, &options) != 0)
    {
        error_message("Could not get current serial attributes: ");
        error_message(strerror(errno));
        return;
    }

    if (cfsetspeed(&options, (speed_t) 500000) < 0) {
        error_message("Could not get current serial baud speed: ");
        error_message(strerror(errno));
        return;
    }

    options.c_cflag |= (CLOCAL | CREAD);  // enable received and set local mode

    options.c_cflag &= ~CSIZE; /* Mask the character size bits */
    options.c_cflag |= CS8; /* Select 8 data bits */

    // no parity
    options.c_cflag &= ~PARENB;
    options.c_cflag &= ~CSTOPB;

    options.c_cflag &= ~CRTSCTS;  // disable flow control

    options.c_iflag &= ~(IGNBRK | BRKINT | PARMRK | ISTRIP | INLCR | IGNCR | ICRNL | IXON);
    options.c_lflag &= ~(ECHO | ECHONL | ICANON | ISIG | IEXTEN);
    options.c_oflag &= ~OPOST;

    if (tcsetattr (fd, TCSANOW, &options) != 0)
    {
        error_message("Could not set current serial attributes: ");
        error_message(strerror(errno));
        return;
    }
    printf("Serial port configured.\n");
}

void interface_uart_write(uint8_t c)
{
    if (write(fd, &c, 1) < 0) {  // TODO - sleep?
        error_message("Failure writing to serial: ");
        error_message(strerror(errno));
    }
}

_Noreturn static void* interface_main_thread(void* data)
{
    (void) data;

    printf("Reading serial...\n");

    while (1) {
        char buf[1];
        int n = read(fd, buf, sizeof buf); // TODO - deal with errors
        if (n < 0) {
            error_message("Failure reading from serial: ");
            error_message(strerror(errno));
        }
        for (int i = 0; i < n; ++i) {
            events_push(E_TEXT_PRINT, (void *)(intptr_t) buf[i]);
        }
    }
}

void interface_uart_read()
{
}

void interface_run_thread()
{
    thread = pthread_create(&thread, NULL, interface_main_thread, (void *) NULL);
}

void interface_destroy()
{
    close(fd);
}
