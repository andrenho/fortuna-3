SRC=glue.c ram.c sdcard.c z80/z80.c fatfs/ff.c fatfs/ffsystem.c miniz/miniz.c

all: fortuna.wasm

fortuna.wasm: ${SRC}
	emcc -Wall -Wextra -o fortuna.js $^ --no-entry -O3 -DNDEBUG=1 \
		-s WASM=1 \
		-s INITIAL_MEMORY=1073741824 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s ABORTING_MALLOC=0 \
		-s ASSERTIONS=1 \
		-s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" \
		-s "EXPORTED_FUNCTIONS=['_malloc', '_free']"

clean:
	rm -f *.o fortuna.wasm

# vim: ts=8:sts=8:sw=8:expandtab
