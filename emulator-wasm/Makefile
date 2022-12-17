include config.mk

all: fortuna.wasm

io/%.c:
	@mkdir -p io
	cp ${COMPUTE_UNIT_DIR}/$@ $@

obj/%.o: %.c
	@mkdir -p $@
	emcc ${CFLAGS} -c $< -o $@

fortuna.wasm: ${OBJ}
	emcc -o fortuna.js $^ ${LDFLAGS}

.PHONY: clean
clean:
	rm -f fortuna.wasm fortuna.js obj/* io/*

# vim: ts=8:sts=8:sw=8:expandtab
