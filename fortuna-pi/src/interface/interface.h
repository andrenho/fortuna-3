#ifndef INTERFACE_H_
#define INTERFACE_H_

void interface_init(const char* serial_port);
void interface_run_thread();
void interface_destroy();

#endif