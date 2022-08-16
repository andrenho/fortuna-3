#ifndef Z80_H_
#define Z80_H_

#include <stdint.h>

void z80_init(void);

void z80_shutdown(void);
void z80_reset(void);

void z80_release_bus(void);
void z80_continue_execution(void);

void z80_iorq(void);

uint8_t z80_post_test(void);
void z80_loop_while_iorq_high(void);

#endif

// vim:ts=4:sts=4:sw=4:expandtab
