SRC=life.c

all: fortuna3.js

fortuna3.js: ${SRC}
	emcc -o fortuna.js $^ -O3 -s NO_EXIT_RUNTIME=1 -s "EXPORTED_RUNTIME_METHODS=['ccall']"

install: fortuna3.js
	mkdir -p ../debugger/src/main/resources/static/emulator
	cp fortuna.js fortuna.wasm ../debugger/src/main/resources/static/emulator/

clean:
	rm fortuna3.js fortuna3.wasm \
		../debugger/src/main/resources/static/emulator/fortuna3.js \
		../debugger/src/main/resources/static/emulator/fortuna3.wasm
