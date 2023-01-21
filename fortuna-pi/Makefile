OBJ=src/main.o
EXE=fortuna-pi

CFLAGS=-Wall -Wextra -std=c11

ifeq ($(OS),Windows_NT)
	EXE := ${EXE}.exe
	CFLAGS := ${CFLAGS} -ISDL2-windows/include/SDL2
	LDFLAGS = -LSDL2-windows/lib -lmingw32 -lSDL2main -lSDL2
else
	CFLAGS := ${CFLAGS} `sdl2-config --cflags`
	LDFLAGS := ${CFLAGS} `sdl2-config --libs`
endif

all: ${EXE}

${EXE}: ${OBJ}
	${CC} -o ${EXE} ${OBJ} ${LDFLAGS}

.PHONY: clean
clean:
ifeq ($(OS),Windows_NT)
	cmd /C "del /Q /F $(subst /,\,${OBJ} ${EXE})"
else
	rm -f ${OBJ} ${EXE}
endif
