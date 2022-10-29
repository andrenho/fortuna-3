COMPUTE_UNIT_DIR=../../../compute-unit
SRC=glue.c sdcard.c cpu.c terminal.c z80/Z80.c fatfs/ff.c fatfs/ffsystem.c miniz/miniz.c \
	io/io.c io/ioregs.c io/iomemory.c io/serial.c \
	dev/ram.c dev/uart.c

all: fortuna.wasm

fortuna.wasm: ${SRC}
	emcc -Wall -Wextra -I. -o fortuna.js $^ --no-entry -O3 -DNDEBUG=1 -D EXECZ80=1 -DEMULATOR=1 \
		-sLLD_REPORT_UNDEFINED \
		-s WASM=1 \
		-s INITIAL_MEMORY=1073741824 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s ABORTING_MALLOC=0 \
		-s ASSERTIONS=1 \
		-s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" \
		-s "EXPORTED_FUNCTIONS=['_malloc', '_free']"

io/ioregs.c:
	cp ${COMPUTE_UNIT_DIR}/io/ioregs.[ch] io/

clean:
	rm -f *.o fortuna.wasm

# vim: ts=8:sts=8:sw=8:expandtab
