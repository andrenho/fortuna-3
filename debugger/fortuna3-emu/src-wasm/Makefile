SRC=life.c

all: fortuna.wasm

fortuna.wasm: ${SRC}
	emcc -Wall -Wextra -o fortuna.wasm $^ --no-entry -O3 \
		-s ERROR_ON_UNDEFINED_SYMBOLS=0 \
		-s WASM=1 \
		-s INITIAL_MEMORY=1073741824 \
		-s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"

clean:
	rm -f *.o fortuna.wasm

// vim: ts=8:sts=8:sw=8:expandtab
