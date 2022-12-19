ifeq ($(OS),Windows_NT)
  $(error "You're running on Windows, so use 'make -f Makefile.win32'")
endif

include doc.mk

check-for-java:
	@type -P mvn || { echo "Could not find mvn in path"; exit 1; }
	@type -P java || { echo "Could not find java in path"; exit 1; }

check-for-npm:
	@type -P npm || { echo "Could not find npm in path"; exit 1; }

build-emulator:
	make -f emulator-wasm

build-backend: check-for-java build-emulator
	cd debugger-backend && mvn install && cd ..

build-frontend: check-for-npm install-emulator
	cd debugger-frontend && npm run build && cd ..

build-jar: build-frontend
	cp -R debugger-frontend/build/* debugger-backend/src/main/resources/static
	cd debugger-backend && mvn clean install && cd ..
	cp debugger-backend/target/fortuna-3-*.jar .
	@echo The debugger can now be run with 'java -DprojectPath=PATH_TO_PROJECT_FILE -jar fortuna-3-*.jar' and can be accessed at 'http://localhost:8025'.

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
	rm -rf debugger-backend/src/main/resources/static
	cd debugger-backend && mvn clean && cd ..

clean-frontend:
	rm -rf debugger-frontend/build
	rm -rf debugger-frontend/public/fortuna

clean: clean-emulator clean-backend clean-frontend

purge:
	git clean -fdx