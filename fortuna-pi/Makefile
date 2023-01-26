SERIAL=/dev/serial0

OBJ=src/main.o src/loop.o src/events.o \
	src/video/window.o src/video/text.o src/video/palette.o src/video/ansi.o
STDIN_OBJ=src/interface/stdin.o
SERIAL_OBJ=src/interface/serial.o
EXE=fortuna-pi

CFLAGS=-Wall -Wextra -std=gnu11 -Isrc

ifeq ($(OS),Windows_NT)
	EXE := ${EXE}.exe
	CFLAGS := ${CFLAGS} -ISDL2-windows/include/SDL2 -O0 -ggdb
	LDFLAGS = -LSDL2-windows/lib -lmingw32 -lSDL2main -lSDL2
else
	CFLAGS := ${CFLAGS} `sdl2-config --cflags` `pkg-config --cflags libgpiod` -O3 -DGPIO
	LDFLAGS := ${CFLAGS} `sdl2-config --libs` `pkg-config --libs libgpiod`
	OBJ += src/interface/gpio.o
endif

all:
	$(info Choose one of: serial, stdin or emulator)

stdin: OBJ += ${STDIN_OBJ}
stdin: LDFLAGS += -lpthread
stdin: ${OBJ} ${STDIN_OBJ}
	${CC} -o ${EXE} $^ ${LDFLAGS}

serial: OBJ += ${SERIAL_OBJ}
serial: CFLAGS += -DSERIAL=\"${SERIAL}\" -DBAUD=$(shell cat ../BAUD)
serial: LDFLAGS += -lpthread
serial: ${OBJ} ${SERIAL_OBJ}
	${CC} -o ${EXE} $^ ${LDFLAGS}

${EXE}: ${OBJ}
	${CC} -o $@ $^ ${LDFLAGS}

.PHONY: clean
clean:
ifeq ($(OS),Windows_NT)
	del /Q /F $(subst /,\,${OBJ} ${STDIN_OBJ} ${SERIAL_OBJ} ${EXE})
else
	rm -f ${OBJ} ${STDIN_OBJ} ${SERIAL_OBJ} ${EXE}
endif
