OBJ=src/main.o
EXE=fortuna-pi

all: ${EXE}

${EXE}: ${OBJ}
	${CC} -o ${EXE} ${OBJ} ${LDFLAGS}

.PHONY: clean
clean:
	rm -f ${OBJ} ${EXE}
