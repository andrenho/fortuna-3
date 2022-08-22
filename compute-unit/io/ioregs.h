#ifndef IO_REGS_H_
#define IO_REGS_H_

#include <stdint.h>

typedef struct {
    uint8_t Pa0, Pa1, Pb0, Pb1;
    uint8_t Qa0, Qa1, Qb0, Qb1;
    uint8_t Ra0, Ra1, Rb0, Rb1;
} IO_Regs;

uint16_t Pa(IO_Regs* r);
uint16_t Pb(IO_Regs* r);

#endif
