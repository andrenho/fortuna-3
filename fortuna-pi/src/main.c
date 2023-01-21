#include "window.h"

#include <stdbool.h>

int main(int argc, char* argv[])
{
    (void) argc; (void) argv;

    window_init();
    while(window_loop_step());
    window_destroy();

    return 0;
}