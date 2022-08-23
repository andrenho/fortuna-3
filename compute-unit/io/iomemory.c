#include "io/iomemory.h"

#include <stddef.h>

#include "dev/ram.h"

void io_mm_cpy(IO_Regs* r)
{
    // TODO - copy full blocks to improve performance

    uint16_t addr_from = Pa(r);
    uint16_t addr_to = Pb(r);
    uint16_t sz = Qa(r);

    for (uint16_t i = 0; i < sz; ++i) {
        uint8_t data = ram_get_byte(addr_from + i);
        ram_set_byte(addr_to + i, data);
    }
}

void io_mm_cpy_far(IO_Regs* r)
{
    // TODO - copy full blocks to improve performance

    uint16_t addr_from = Pa(r);
    uint16_t addr_to = Pb(r);
    uint8_t bank_from = r->Qb0;
    uint8_t bank_to = r->Qb1;
    uint16_t sz = Qa(r);

    for (uint16_t i = 0; i < sz; ++i) {
        ram_set_bank(bank_from);
        uint8_t data = ram_get_byte(addr_from + i);
        ram_set_bank(bank_to);
        ram_set_byte(addr_to + i, data);
    }
}

void io_mm_strcpy(IO_Regs* r)
{
}

void io_mm_strcpy_far(IO_Regs* r)
{
}

void io_mm_strlen(IO_Regs* r)
{
}

void io_mm_strcmp(IO_Regs* r)
{
}

void io_mm_strsub(IO_Regs* r)
{
}

void io_mm_strchr(IO_Regs* r)
{
}

void io_mm_set(IO_Regs* r)
{
}

void io_mm_to_dec(IO_Regs* r)
{
}

void io_mm_to_hex(IO_Regs* r)
{
}

void io_mm_to_bin(IO_Regs* r)
{
}

// vim:ts=4:sts=4:sw=4:expandtab
