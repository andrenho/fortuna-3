#include "interface.h"
#include "../events.h"

#include <errno.h>
#include <fcntl.h>
#include <pthread.h>
#include <stdio.h>
#include <string.h>
#include <termios.h>
#include <unistd.h>

static int fd = 0;
static pthread_t thread;

void interface_init()
{
    fd = open(SERIAL, O_RDWR | O_NOCTTY | O_NDELAY);
    if (fd < 0) {
        fprintf(stderr, "error %d opening %s: %s", errno, SERIAL, strerror (errno));
        return;  // TODO
    }
    printf("Serial port initialized.\n");

    fcntl(fd, F_SETFL, 0);

    struct termios options;
    if (tcgetattr (fd, &options) != 0)
    {
        fprintf(stderr, "error %d from tcgetattr", errno);
        return;
    }

    printf("%d\n", cfsetspeed(&options, (speed_t) 500000));

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
        fprintf(stderr, "error %d from tcsetattr", errno);
        return;
    }
    printf("Serial port configured.\n");

    // set_interface_attribs(fd, 1000000, 0);  // TODO - deal with errors
    // set_blocking(fd, 0);
}

void interface_uart_write(uint8_t c)
{
    write(fd, &c, 1);  // TODO - sleep?
}

_Noreturn static void* interface_main_thread(void* data)
{
    (void) data;

    printf("Reading serial...\n");

    while (1) {
        char buf[1];
        int n = read(fd, buf, sizeof buf); // TODO - deal with errors
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
