#include "interface.h"

#include <stdio.h>
#include <string.h>
#include <pthread.h>

#include "../events.h"

static pthread_t thread;

void interface_init()
{
}

_Noreturn static void* interface_main_thread(void *)
{
    while (1) {
        printf("? ");

        char command[25];
        if (scanf("%24s", command)) {
            if (strcmp(command, "setbg") == 0) {
                int bg;
                if (scanf("%d", &bg)) {
                    events_push(E_CHANGE_BACKGROUND, (void*)(intptr_t) bg);
                } else {
                    goto syntax_error;
                }
            } else if (strlen(command) == 1) {
                events_push(E_TEXT_PRINT, (void*)(intptr_t) command[0]);
            } else {
                goto syntax_error;
            }
        }

        continue;
syntax_error:
        printf("Syntax error.\n");
    }

}

void interface_uart_write(uint8_t c)
{
    if (c >= 32 && c < 127)
        printf("Sent char '%c'.\n", (char) c);
    else
        printf("Sent char 0x%02X.\n", c);
}

void interface_run_thread()
{
    thread = pthread_create(&thread, NULL, interface_main_thread, (void *) NULL);
    printf("%p\n", &thread);
}

void interface_uart_read()
{
}

void interface_destroy()
{
    pthread_kill(thread, 9);
}