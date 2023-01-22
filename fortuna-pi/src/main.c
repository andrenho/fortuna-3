#include "window.h"
#include "loop.h"
#include "text.h"
#include "palette.h"

#include <stdbool.h>

int main(int argc, char* argv[])
{
    (void) argc; (void) argv;

    window_init();
    palette_init();
    loop_init();
    text_init();

    loop();

    text_destroy();
    loop_destroy();
    palette_destroy();
    window_destroy();

    return 0;
}