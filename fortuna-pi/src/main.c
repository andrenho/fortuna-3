#include "loop.h"
#include "events.h"
#include "interface/interface.h"
#include "interface/gpio.h"
#include "video/text.h"
#include "video/palette.h"
#include "video/window.h"

void fortunapi_init()
{
    window_init();
    interface_init();
    events_init();
    palette_init();
    loop_init();
    text_init();
#ifdef GPIO
    gpio_reset();
#endif

    /*
    const char* text = "\e[4;4H\e[2JRandom seed is 0xabcdef00.\n\e[0;32mError initializing SDCard.\e[0m\n";
    for (int i = 0; i < 8; ++i)
        for (const char *s = text; *s; ++s)
            events_push(E_TEXT_PRINT, (void *) *s);
    */
}

void fortunapi_reset()
{
    window_reset();
    interface_reset();
    events_reset();
    palette_reset();
    text_reset();
    loop_reset();
#ifdef GPIO
    gpio_reset();
#endif
}

void fortunapi_destroy()
{
    text_destroy();
    loop_destroy();
    palette_destroy();
    events_destroy();
    interface_destroy();
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
