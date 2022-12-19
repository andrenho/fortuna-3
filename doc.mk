E :=

all:
	$(info The following targets are available:)
	$(info $E    build-jar         Generate a full jar containing the backend and frontend.)
	$(info $E)
	$(info These targets are useful for development, for building and running the debugger partially:)
	$(info $E    install-emulator  Generate the WASM file and put it on the frontend)
	$(info $E    run-backend)
	$(info $E    run-fronend)
	$(info $E    run-storybook)
	$(info $E)
	$(info The clean targets can be used to selectively clean parts of the debugger.)
	$(info $E    purge             Remove all files not controlled by git.)
	$(info $E)
