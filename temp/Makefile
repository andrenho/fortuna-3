OBJ = main.o fsfat/ff.o fsfat/ffsystem.o fsfat/diskio.o

CFLAGS=-Wall -Wextra -I. -ggdb -O0

test: ${OBJ}
	gcc -o $@ $^

clean:
	rm -f *.o **/*.o test

# vim:ts=8:sts=8:sw=8:noexpandtab
