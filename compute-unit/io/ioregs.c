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

// vim:ts=4:sts=4:sw=4:expandtab
