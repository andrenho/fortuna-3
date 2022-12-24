#!/usr/bin/env python3

import sys

import serial


def print_usage(exit_code):
    print(f"Usage: {sys.argv[0]} SERIAL_PORT COMMANDS")
    print()
    print("Available commands:")
    print("   upload-ram BANK LOCATION FILENAME")
    print()
    sys.exit(exit_code)


def parse_arguments(argv):

    def assert_args(n):
        if len(argv) < n:
            print_usage(1)

    def pop_int():
        try:
            return int(argv.pop(0))
        except ValueError:
            print_usage(1)

    commands = []
    assert_args(2)

    argv.pop(0)
    serial_port = argv.pop(0)
    while len(argv) > 0:
        cmd = argv.pop(0)
        if cmd == 'upload-ram':
            assert_args(3)
        else:
            raise Exception("Invalid command " + cmd)
        commands.append([ 'upload-ram', pop_int(), pop_int(), argv.pop(0) ])

    return serial_port, commands


def execute(serial_port, commands):
    ser = serial.Serial(serial_port, baudrate = 1000000, timeout = 0.5)
    ser.write(b"\xfe\xf0")
    for cmd in commands:
        if cmd[0] == 'upload-ram':
            with open(cmd[3], 'rb') as f:
                b = f.read()
                if len(b) > (64 * 1024):
                    raise Exception("File is too big")
                ser.write(b"\x01")
                ser.write(cmd[1].to_bytes(1, 'little'))
                ser.write(cmd[2].to_bytes(2, 'little'))
                ser.write(len(b).to_bytes(2, 'little'))
                ser.write(b)
    ser.write(b"\xff")
    c = ser.read(1)
    if c[0] == 0:
        print('File ' + cmd[3] + ' uploaded to RAM successfully.')
    else:
        print('There was an error uploading file ' + cmd[3] + ': ' + str(c[0]))
        sys.exit(1)
    ser.close()

if __name__ == "__main__":
    serial_port, commands = parse_arguments(sys.argv)
    execute(serial_port, commands)
