#
# Compiler configuration
#
CFLAGS=-std=c11 -Wall -Wextra -I. -O3 -DNDEBUG=1 -D EXECZ80=1 -DEMULATOR=1 -DINCLUDE_SDCARD=1 -I${COMPUTE_UNIT_DIR}
LDFLAGS=-std=c11 -Wall -Wextra --no-entry -O3 \
		-s LLD_REPORT_UNDEFINED \
		-s WASM=1 \
		-s INITIAL_MEMORY=1073741824 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s ABORTING_MALLOC=0 \
		-s ASSERTIONS=1 \
		-s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" \
		-s "EXPORTED_FUNCTIONS=['_malloc', '_free']"

#
# Objects to compile
#
COMPUTE_UNIT_DIR=../compute-unit
SRC_IO=io/io.c io/ioregs.c io/iomemory.c io/serial.c io/iolcd.c io/iofs.c
SRC=glue.c sdcard.c cpu.c terminal.c fs.c \
	z80/Z80.c fsfat/ff.c fsfat/ffsystem.c miniz/miniz.c \
	dev/ram.c dev/uart.c dev/lcd.c dev/rtc.c dev/eeprom.c dev/random.c \
	${SRC_IO}
OBJ=$(foreach f,${SRC},obj/$(f:.c=.o))

#
# Rules
#

all: fortuna.wasm

io/%.c:
ifeq ($(OS),Windows_NT)
	copy /Y $(subst /,\,${COMPUTE_UNIT_DIR}/$@ $@)
else
	cp ${COMPUTE_UNIT_DIR}/$@ $@
endif

${OBJ_DIRS}:

obj/%.o: %.c
ifeq ($(OS),Windows_NT)
	-@if not exist $(subst /,\,$(dir $@)) mkdir $(subst /,\,$(dir $@)) 2>NUL
else
	@mkdir -p $@
endif
	emcc ${CFLAGS} -c $< -o $@

fortuna.wasm: ${OBJ}
	emcc -o fortuna.js $^ ${LDFLAGS}

.PHONY: clean
clean:
ifeq ($(OS),Windows_NT)
	del /Q /S fortuna.wasm fortuna.js obj\* io\* 2>NUL
else
	rm -f fortuna.wasm fortuna.js obj/* io/*
endif

# vim: ts=8:sts=8:sw=8:expandtab
