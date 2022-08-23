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
uint16_t Qa(IO_Regs* r);
uint16_t Qb(IO_Regs* r);
uint32_t P(IO_Regs* r);
uint32_t Q(IO_Regs* r);

uint16_t set_Ra(IO_Regs* r, uint16_t value);
uint16_t set_Rb(IO_Regs* r, uint16_t value);
uint32_t set_R(IO_Regs* r, uint32_t value);

#endif
