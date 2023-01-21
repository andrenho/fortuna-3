#include "window.h"
#include "text.h"

#include <stdbool.h>

int main(int argc, char* argv[])
{
    (void) argc; (void) argv;

    window_init();
    text_init();

    window_main_loop();

    text_destroy();
    window_destroy();

    return 0;
}