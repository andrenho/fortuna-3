#ifndef CPU_H_
#define CPU_H_

#include <stdbool.h>
#include <stdint.h>

#define MAX_BKPS 64

extern uint16_t bkp[MAX_BKPS];

void bkp_clear();
void bkp_add(uint16_t addr);
void bkp_del(uint16_t addr);

bool bkp_has();
bool bkp_is(uint16_t addr);

#endif
