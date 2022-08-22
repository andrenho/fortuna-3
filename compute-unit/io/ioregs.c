#include "io/ioregs.h"

uint16_t Pa(IO_Regs* r)
{
    return (((uint16_t) r->Pa1) << 8) | r->Pa0;
}

uint16_t Pb(IO_Regs* r)
{
    return (((uint16_t) r->Pb1) << 8) | r->Pb0;
}

// vim:ts=4:sts=4:sw=4:expandtab
