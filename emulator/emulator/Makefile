SRC=life.c

all: fortuna3.js

fortuna3.js: ${SRC}
	emcc -o fortuna.wasm $^ --no-entry -O3 -s WASM=1 -s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']"

install: fortuna.wasm
	mkdir -p ../debugger/src/main/resources/static/emulator
	cp fortuna.wasm ../debugger/src/main/resources/static/emulator/

clean:
	rm fortuna.wasm
