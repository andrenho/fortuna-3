#include "window.h"

#include <stdbool.h>

int main(int argc, char* argv[])
{
    (void) argc; (void) argv;

    window_init();
    window_main_loop();
    window_destroy();

    return 0;
}