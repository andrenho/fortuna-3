#include "io/iomemory.h"

#include <avr/pgmspace.h>
#include <inttypes.h>
#include <stddef.h>
#include <stdio.h>

#include "ansi.h"
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
    uint8_t current_bank = ram_bank();

    for (uint16_t i = 0; i < sz; ++i) {
        ram_set_bank(bank_from);
        uint8_t data = ram_get_byte(addr_from + i);
        ram_set_bank(bank_to);
        ram_set_byte(addr_to + i, data);
    }

    ram_set_bank(current_bank);
}

void io_mm_strcpy(IO_Regs* r)
{
    uint16_t origin = Pa(r);
    uint16_t destination = Pb(r);

    uint8_t data;
    uint16_t count = 0;
    do {
        data = ram_get_byte(origin++);
        ram_set_byte(destination++, data);
        ++count;
    } while (data != 0);

    set_R(r, count);
}

void io_mm_strcpy_far(IO_Regs* r)
{
    uint16_t origin = Pa(r);
    uint16_t destination = Pb(r);
    uint8_t bank_from = r->Qb0;
    uint8_t bank_to = r->Qb1;
    uint8_t current_bank = ram_bank();

    uint8_t data;
    uint16_t count = 0;
    do {
        ram_set_bank(bank_from);
        data = ram_get_byte(origin++);
        ram_set_bank(bank_to);
        ram_set_byte(destination++, data);
        ++count;
    } while (data != 0);

    ram_set_bank(current_bank);
    set_R(r, count);
}

void io_mm_strlen(IO_Regs* r)
{
    uint16_t count = 0;
    uint16_t addr = Pa(r);

    while (ram_get_byte(addr++) != 0)
        ++count;

    set_R(r, count);
}

void io_mm_strcmp(IO_Regs* r)
{
    uint16_t str1 = Pa(r);
    uint16_t str2 = Pb(r);
    uint16_t i = 0;

    uint8_t data1, data2;
    do {
        data1 = ram_get_byte(str1 + i);
        data2 = ram_get_byte(str2 + i);
        if (data1 != data2) {
            r->Ra0 = 1;
            return;
        }
        
    } while (data1 != 0 && data2 != 0);

    r->Ra0 = 0;
}

void io_mm_strsub(IO_Regs* r)
{
    printf_P(PSTR(RED "SUBSTR not implemented yet" RST));  // TODO
    for (;;);
}

void io_mm_strchr(IO_Regs* r, uint8_t data)
{
    uint16_t addr = Pa(r);
    uint16_t count = 0;

    uint8_t chr;
    while ((chr = ram_get_byte(addr++)) != 0) {
        if (chr == data) {
            set_Ra(r, count);
        }
        ++count;
    }

    set_Ra(r, 0xffff); // not found
}

void io_mm_set(IO_Regs* r, uint8_t data)
{
    uint16_t addr = Pa(r);
    uint16_t len = Pb(r);

    for (uint16_t i = 0; i < len; ++i)
        ram_set_byte(addr + i, data);
}

void io_mm_to_dec(IO_Regs* r)
{
    uint16_t addr = Qa(r);

    char buf[16];
    snprintf_P(buf, sizeof buf, PSTR("%"PRIu32), P(r));

    char* p = buf;
    do {
        ram_set_byte(addr++, *p);
    } while ((*p)++ != 0);
}

void io_mm_to_hex(IO_Regs* r, uint8_t data)
{
    uint16_t addr = Qa(r);

    char buf[9];
    snprintf_P(buf, sizeof buf, PSTR("%0.*X"), data * 2, P(r));

    char* p = buf;
    do {
        ram_set_byte(addr++, *p);
    } while ((*p)++ != 0);
}

// vim:ts=4:sts=4:sw=4:expandtab
