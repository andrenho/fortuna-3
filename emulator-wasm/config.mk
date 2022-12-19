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
SRC=globals.c \
 	util/compress.c \
	emulation/emulator.c emulation/cpu.c emulation/state.c emulation/sdcard.c emulation/terminal.c emulation/fs.c \
	z80/Z80.c fsfat/ff.c fsfat/ffsystem.c miniz/miniz.c \
	dev/ram.c dev/uart.c dev/lcd.c dev/rtc.c dev/eeprom.c dev/random.c \
	${SRC_IO}
OBJ=$(foreach f,${SRC},obj/$(f:.c=.o))
