#
# OS configuration
#
CC=emcc
RM_OPS=-f

#
# Compiler configuration
#
CFLAGS=-std=c11 -Wall -Wextra -I. -O3 -DNDEBUG=1 -D EXECZ80=1 -DEMULATOR=1 -DINCLUDE_SDCARD=1 -I${COMPUTE_UNIT_DIR}

#
# Objects to compile
#
COMPUTE_UNIT_DIR=../compute-unit
IO=${COMPUTE_UNIT_DIR}/io
OBJ=glue.o sdcard.o cpu.o terminal.o fs.o \
	z80/Z80.o fsfat/ff.o fsfat/ffsystem.o miniz/miniz.o \
	${IO}/io.o ${IO}/ioregs.o ${IO}/iomemory.o ${IO}/serial.o ${IO}/iolcd.o ${IO}/iofs.o \
	dev/ram.o dev/uart.o dev/lcd.o dev/rtc.o dev/eeprom.o dev/random.o

#
# Windows exceptions
#
ifeq ($(OS),Windows_NT)
  RM=del
  RM_OPS=/Q
  # OBJ:=$(subst \/,\\,$(OBJ))
endif

#
# Rules
#

all: fortuna.wasm

fortuna.wasm: ${OBJ}
	emcc -std=c11 -Wall -Wextra -o fortuna.js $^ --no-entry -O3 \
		-s LLD_REPORT_UNDEFINED \
		-s WASM=1 \
		-s INITIAL_MEMORY=1073741824 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s ABORTING_MALLOC=0 \
		-s ASSERTIONS=1 \
		-s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" \
		-s "EXPORTED_FUNCTIONS=['_malloc', '_free']"

#io/ioregs.c:
#	cp ${COMPUTE_UNIT_DIR}/io/ioregs.[ch] io/


# vim: ts=8:sts=8:sw=8:expandtab
