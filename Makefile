# TODO - check binaries in PATH

all:
ifeq ($(OS),Windows_NT)
	cmd /c "cd emulator-wasm & make"
	cmd /c "cd debugger-backend & mvn install"
else
	make -f emulator-wasm
	cd debugger-backend && mvn install && cd ..
endif

.PHONY: clean
clean:
ifeq ($(OS),Windows_NT)
	cmd /c "cd emulator-wasm & make clean"
	cmd /c "cd debugger-backend & mvn clean"
else
	make -f emulator-wasm
	cd debugger-backend && mvn clean && cd ..
endif