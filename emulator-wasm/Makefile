ifeq ($(OS),Windows_NT)
  $(error "You're running on Windows, so use 'make -f Makefile.win32'")
endif

include config.mk

all: fortuna.wasm

.PHONY: check-for-emcc
check-for-emcc:
	@type -P emcc || { echo "Could not find emcc in path"; exit 1; }

io/%.c:
	@mkdir -p io
	cp ${COMPUTE_UNIT_DIR}/$@ $@

obj/%.o: %.c check-for-emcc
	@mkdir -p $@
	emcc ${CFLAGS} -c $< -o $@

fortuna.wasm: ${OBJ}
	emcc -o fortuna.js $^ ${LDFLAGS}

.PHONY: clean
clean:
	rm -f fortuna.wasm fortuna.js obj/* io/*

# vim: ts=8:sts=8:sw=8:expandtab
