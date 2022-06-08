SRC=fromjs.c

all: fortuna3.wasm

fortuna.wasm: ${SRC}
	emcc -o fortuna.wasm $^ --no-entry -O3 -s WASM=1 -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"

install: fortuna.wasm fortuna.js
	mkdir -p ../debugger/src/main/resources/static/emulator
	cp fortuna.wasm fortuna.js ../debugger/src/main/resources/static/emulator/

clean:
	rm -f *.o fortuna.wasm
