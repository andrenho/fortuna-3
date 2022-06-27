#ifndef CPU_H_
#define CPU_H_

#include <stdint.h>

#define MAX_BKPS 64

extern uint16_t bkp[MAX_BKPS];

void bkp_clear();
void bkp_add(uint16_t addr);
void bkp_del(uint16_t addr);

#endif
