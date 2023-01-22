#include "video/window.h"
#include "loop.h"
#include "video/text.h"
#include "video/palette.h"

void fortunapi_init()
{
    window_init();
    palette_init();
    loop_init();
    text_init();
}

void fortunapi_destroy()
{
    text_destroy();
    loop_destroy();
    palette_destroy();
    window_destroy();
}

int main(int argc, char* argv[])
{
    (void) argc; (void) argv;

    fortunapi_init();
    loop();
    fortunapi_destroy();

    return 0;
}