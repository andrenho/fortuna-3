#ifndef PGMSPACE_H_
#define PGMSPACE_H_

#define PGM_P const char *

#define snprintf_P(...) snprintf(__VA_ARGS__)
#define printf_P(...) printf(__VA_ARGS__)
#define PSTR(...) __VA_ARGS__

#endif