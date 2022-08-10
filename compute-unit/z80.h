#ifndef Z80_H_
#define Z80_H_

void z80_init(void);

void z80_start(void);

void z80_release_bus(void);
void z80_continue_execution(void);

#endif

// vim:ts=4:sts=4:sw=4:expandtab
