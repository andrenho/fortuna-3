#include "video/window.h"
#include "loop.h"
#include "video/text.h"
#include "video/palette.h"
#include "events.h"

void fortunapi_init()
{
    window_init();
    events_init();
    palette_init();
    loop_init();
    text_init();

    events_push(E_TEXT_OUTPUT, (void *) 'H');
}

void fortunapi_destroy()
{
    text_destroy();
    loop_destroy();
    palette_destroy();
    events_destroy();
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