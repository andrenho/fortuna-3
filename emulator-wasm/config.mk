COMPUTE_UNIT_DIR=../compute-unit
PI_DIR=../fortuna-pi

#
# Compiler configuration
#
CFLAGS=-std=c11 -Wall -Wextra -I. -O3 -DNDEBUG=1 -D EXECZ80=1 -DEMULATOR=1 -DINCLUDE_SDCARD=1 -I${COMPUTE_UNIT_DIR} -I${PI_DIR}
LDFLAGS=-std=c11 -Wall -Wextra --no-entry -O3 \
		-s LLD_REPORT_UNDEFINED \
		-s WASM=1 \
		-s USE_SDL=2 \
		-s INITIAL_MEMORY=1073741824 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s ABORTING_MALLOC=0 \
		-s ASSERTIONS=1 \
		-s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" \
		-s "EXPORTED_FUNCTIONS=['_malloc', '_free']" \
		--use-preload-plugins
#		--preload-file resource

#
# Objects to compile
#
SRC_IO=io/io.c io/ioregs.c io/iomemory.c io/serial.c io/iolcd.c io/iofs.c
SRC_PI=${PI_DIR}/src/main.c ${PI_DIR}/src/loop.c \
	${PI_DIR}/src/video/window.c ${PI_DIR}/src/video/text.c ${PI_DIR}/src/video/palette.c
SRC=globals.c \
 	util/compress.c \
	emulation/emulator.c emulation/cpu.c emulation/state.c emulation/sdcard.c emulation/terminal.c emulation/fs.c \
	z80/Z80.c fsfat/ff.c fsfat/ffsystem.c miniz/miniz.c \
	dev/ram.c dev/uart.c dev/lcd.c dev/rtc.c dev/eeprom.c dev/random.c \
	${SRC_IO} ${SRC_PI}
OBJ=$(foreach f,${SRC},obj/$(f:.c=.o))
