COMPUTE_UNIT_DIR=../../../compute-unit
IO=${COMPUTE_UNIT_DIR}/io
SRC=glue.c sdcard.c cpu.c terminal.c z80/Z80.c fsfat/ff.c fsfat/ffsystem.c miniz/miniz.c \
	${IO}/io.c ${IO}/ioregs.c ${IO}/iomemory.c ${IO}/serial.c ${IO}/eeprom.c ${IO}/iolcd.c \
	dev/ram.c dev/uart.c dev/lcd.c dev/rtc.c dev/eeprom.c dev/random.c

all: fortuna.wasm

fortuna.wasm: ${SRC}
	emcc -Wall -Wextra -I. -o fortuna.js $^ --no-entry -O3 -DNDEBUG=1 -D EXECZ80=1 -DEMULATOR=1 -DINCLUDE_SDCARD=0 \
		-sLLD_REPORT_UNDEFINED \
		-s WASM=1 \
		-s INITIAL_MEMORY=1073741824 \
		-s ALLOW_MEMORY_GROWTH=1 \
		-s ABORTING_MALLOC=0 \
		-s ASSERTIONS=1 \
		-s "EXPORTED_RUNTIME_METHODS=['ccall', 'cwrap']" \
		-s "EXPORTED_FUNCTIONS=['_malloc', '_free']"

io/ioregs.c:
	cp ${COMPUTE_UNIT_DIR}/io/ioregs.[ch] io/

clean:
	rm -f *.o fortuna.wasm

# vim: ts=8:sts=8:sw=8:expandtab
