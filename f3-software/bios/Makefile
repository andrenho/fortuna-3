SRC=bios.z80
DST=bios.bin
SERIAL_PORT=/dev/serial0

all: ${DST}

%.bin: %.z80
	vasmz80_oldstyle -Fbin -I.. -o $@ $<

upload: ${DST}
	../../f3-remote.py ${SERIAL_PORT} upload-ram 0 0 ${DST}

.PHONY: clean
clean:
	rm -f *.bin

# vim:ts=8:sts=8:sw=8:noexpandtab
