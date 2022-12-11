#ifndef FS_H_
#define FS_H_

#include <sys/types.h>
#include <stddef.h>
#include <stdint.h>

void    fs_init();
ssize_t fs_dir(const char* dir_name, size_t n_records, void* buf);
ssize_t fs_chdir_up(const char* dir_name, size_t sz, void* buf);
ssize_t fs_file_page(const char* dir_name, const char* filename, size_t page, void* buf);

#endif