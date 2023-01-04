#ifndef REMOTE_H_
#define REMOTE_H_

#include <stdbool.h>

void remote_init(void);

bool remote_active(void);
void remote_execute(void);

#endif
