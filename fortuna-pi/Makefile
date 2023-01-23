OBJ=src/main.o src/loop.o src/events.o \
	src/video/window.o src/video/text.o src/video/palette.o
SERIAL_OBJ=src/interface/stdin.o
EXE=fortuna-pi

CFLAGS=-Wall -Wextra -std=c11 -Isrc

ifeq ($(OS),Windows_NT)
	EXE := ${EXE}.exe
	CFLAGS := ${CFLAGS} -ISDL2-windows/include/SDL2 -O0 -ggdb
	LDFLAGS = -LSDL2-windows/lib -lmingw32 -lSDL2main -lSDL2
else
	CFLAGS := ${CFLAGS} `sdl2-config --cflags` -O3
	LDFLAGS := ${CFLAGS} `sdl2-config --libs`
endif

all: ${EXE}

serial: OBJ += ${SERIAL_OBJ}
serial: LDFLAGS += -lpthread
serial: ${OBJ} ${SERIAL_OBJ}
	${CC} -o ${EXE} $^ ${LDFLAGS}

${EXE}: ${OBJ}
	${CC} -o $@ $^ ${LDFLAGS}

.PHONY: clean
clean:
ifeq ($(OS),Windows_NT)
	cmd /C "del /Q /F $(subst /,\,${OBJ} ${SERIAL_OBJ} ${EXE})"
else
	rm -f ${OBJ} ${SERIAL_OBJ} ${EXE}
endif
