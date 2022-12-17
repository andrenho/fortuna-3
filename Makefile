# TODO - check binaries in PATH

ifeq ($(OS),Windows_NT)
  $(error You're running on Windows, so use 'make -f Makefile.win32')
endif

all: build-backend

build-emulator:
	make -f emulator-wasm

build-backend: build-emulator
	cd debugger-backend && mvn install && cd ..

clean-emulator:
	make -f emulator-wasm clean

clean-backend:
	cd debugger-backend && mvn clean && cd ..

clean: clean-emulator clean-backend