SRC=fromjs.c emulator.c sdcard.c fatfs/ff.c fatfs/ffsystem.c z80/Z80.c

all: fortuna.wasm

fortuna.wasm: ${SRC}
	emcc -Wall -Wextra -o fortuna.wasm $^ --no-entry -O3 -sERROR_ON_UNDEFINED_SYMBOLS=0 -s WASM=1 -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"

install: fortuna.wasm
	mkdir -p ../debugger/src/main/resources/static/emulator
	cp fortuna.wasm ../debugger/src/main/resources/static/emulator/

clean:
	rm -f *.o fortuna.wasm

// vim: ts=8:sts=8:sw=8:expandtab
