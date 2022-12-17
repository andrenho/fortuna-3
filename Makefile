# TODO - check binaries in PATH

ifeq ($(OS),Windows_NT)
  $(error "You're running on Windows, so use 'make -f Makefile.win32'")
endif

all: build-backend
	# TODO - describe commands

build-emulator:
	make -f emulator-wasm

build-backend: build-emulator
	cd debugger-backend && mvn install && cd ..

install-emulator: build-emulator
	mkdir debugger-frontend/public/fortuna
	cp emulator-wasm/fortuna.js emulator-wasm/fortuna.wasm debugger-frontend/public/fortuna

run-frontend: install-emulator
	cd debugger-frontend && npm install && npm run start && cd ..

run-storybook:
	cd debugger-frontend && npm install && npm run storybook && cd ..

run-backend: build-backend
	cd debugger-backend && java -DprojectPath="sample-project/my-project.json" -jar ./target/fortuna-3-0.0.1-SNAPSHOT.jar && cd ..

clean-emulator:
	make -f emulator-wasm clean

clean-backend:
	cd debugger-backend && mvn clean && cd ..

clean: clean-emulator clean-backend

purge:
	git clean -fdx