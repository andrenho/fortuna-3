#include <emscripten/emscripten.h>

#include "emulator.h"

#include <stdio.h>
#include <sys/time.h>

#include "dev/ram.h"
#include "dev/lcd.h"
#include "dev/rtc.h"
#include "dev/random.h"
#include "emulation/cpu.h"
#include "globals.h"
#include "io/io.h"
#include "sdcard.h"
#include "terminal.h"
#include "z80/Z80.h"
#include "src/window.h"

static bool sdl_initialized = false;

EMSCRIPTEN_KEEPALIVE bool emulator_initialize(size_t sdcard_sz_in_mb)
{
    ResetZ80(&z80);
    ram_init();
    bkp_clear();

    for (size_t i = 0; i <= 0xb; ++i)
        io_write(i, 0);

    random_init();
    lcd_init();
    rtc_init();

    bool r = sdcard_init(sdcard_sz_in_mb MB);

    puts("Emulator initialized.");

    if (!sdl_initialized) {
        sdl_init();
        window_init();
        sdl_initialized = true;
    }

    return r;
}

EMSCRIPTEN_KEEPALIVE uint16_t emulator_step()
{
    ExecZ80(&z80, 1);
    return z80.PC.W;
}

EMSCRIPTEN_KEEPALIVE FinishReason emulator_step_cycles(int ms)
{
    struct timeval t1, t2;
    gettimeofday(&t1, NULL);

    for(;;) {
        ExecZ80(&z80, 1);
        if (bkp_is(z80.PC.W))
            return BREAKPOINT;

        gettimeofday(&t2, NULL);

        double elapsed = ((t2.tv_sec - t1.tv_sec) * 1000.0) + (t2.tv_usec - t1.tv_usec) / 1000.0;
        if (elapsed >= ms)
            return NORMAL;
    }
}

EMSCRIPTEN_KEEPALIVE void emulator_keypress(uint8_t chr)
{
    uart_last_keypress = chr;
}

void emscripten_notify_memory_growth(size_t i) { (void) i; }
