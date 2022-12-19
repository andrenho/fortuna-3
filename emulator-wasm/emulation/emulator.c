#include <emscripten/emscripten.h>

#include "emulator.h"

#include <stdio.h>

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
    return r;
}

EMSCRIPTEN_KEEPALIVE void emulator_step()
{
    ExecZ80(&z80, 1);
}

EMSCRIPTEN_KEEPALIVE FinishReason emulator_step_cycles(int cycles)
{
    if (bkp_has()) {
        while (cycles > 0) {
            cycles -= ExecZ80(&z80, 1);
            if (bkp_is(z80.PC.W))
                return BREAKPOINT;
        }
    } else {
        ExecZ80(&z80, cycles);
    }
    return NORMAL;
}

EMSCRIPTEN_KEEPALIVE void emulator_keypress(uint8_t chr)
{
    uart_last_keypress = chr;
}

void emscripten_notify_memory_growth(size_t i) { (void) i; }
