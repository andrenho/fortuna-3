#include "io/ioregs.h"

uint16_t Pa(IO_Regs* r)
{
    return (((uint16_t) r->Pa1) << 8) | r->Pa0;
}

uint16_t Pb(IO_Regs* r)
{
    return (((uint16_t) r->Pb1) << 8) | r->Pb0;
}

uint16_t Qa(IO_Regs* r)
{
    return (((uint16_t) r->Qa1) << 8) | r->Qa0;
}

uint16_t Qb(IO_Regs* r)
{
    return (((uint16_t) r->Qb1) << 8) | r->Qb0;
}

uint32_t P(IO_Regs* r)
{
    return (((uint32_t) Pb(r)) << 16) | Pa(r);
}

uint32_t Q(IO_Regs* r)
{
    return (((uint32_t) Qb(r)) << 16) | Qa(r);
}

uint16_t set_Ra(IO_Regs* r, uint16_t value)
{
    r->Ra0 = value & 0xff;
    r->Ra1 = value >> 8;
}

uint16_t set_Rb(IO_Regs* r, uint16_t value)
{
    r->Rb0 = value & 0xff;
    r->Rb1 = value >> 8;
}

uint32_t set_R(IO_Regs* r, uint32_t value)
{
    set_Ra(r, value & 0xffff);
    set_Rb(r, value >> 16);
}

// vim:ts=4:sts=4:sw=4:expandtab
