all:
ifeq ($(OS),Windows_NT)
	cmd /c "cd emulator-wasm & make"
else
	make -f emulator-wasm
endif

.PHONY: clean
clean:
ifeq ($(OS),Windows_NT)
	cmd /c "cd emulator-wasm & make clean"
else
	make -f emulator-wasm
endif