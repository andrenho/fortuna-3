#include "dev/random.h"

#include <stdlib.h>
#include <time.h>

uint32_t random_init(void)
{
    uint32_t seed = time(NULL);
    srand(seed);
    return seed;
}

uint32_t random_value(void)
{
    return (uint32_t) rand();
}