#!/usr/bin/env python3

import logging
import os
import socket
import subprocess
import sys
import time
import traceback
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

import RPi.GPIO as GPIO
import serial

PORT = 8026
RESET_GPIO = 8
REMOTE_GPIO = 26 # 3
COMPUTE_UNIT_DIR = '../compute-unit'
serial_port = ''

with open("BAUD") as f:
    BAUD = int(f.readline())

class FortunaSerialConnection:

    def __init__(self, port, timeout=2):
        self.port = port
        self.timeout = timeout

    def __enter__(self):
        logging.info('Connecting to serial port: ' + self.port)
        self.ser = serial.Serial(self.port, baudrate = BAUD, timeout = self.timeout)
        return self

    def __exit__(self, *args):
        logging.info('Disconnecting from serial port.')
        self.ser.close()

    def check_response(self):
        c = self.ser.read(1)
        if len(c) < 1:
            raise Exception("No response received")
        logging.info('Response received: ' + str(int(c[0])))
        if (c[0] == b'g'):
            raise Exception("Generic error while communicating");
        elif (c[0] == b'l'):
            raise Exception("Error: file too large")
        elif (c[0] == b's'):
            raise Exception("Error: SDCard access error")
        elif (c[0] == b'i'):
            raise Exception("Error: invalid command")
        elif (c[0] > 0):
            raise Exception("Unknown error: " + str(int(c[0])))

    def activate_remote(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(REMOTE_GPIO, GPIO.OUT)
        GPIO.output(REMOTE_GPIO, GPIO.LOW)
        time.sleep(0.2)

    def deactivate_remote(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(REMOTE_GPIO, GPIO.IN)
        GPIO.cleanup()

    def send_bytes(self, bts):
        for b in bts:
            self.ser.write(b.to_bytes(1, 'big'))
            expected = (b + 1) & 0xff
            c = self.ser.read(1)
            if c[0] != expected:
                raise Exception("Invalid response, expected " + str(expected) + ", received " + str(c[0]))

class FortunaManager:

    @staticmethod
    def execute(*args):
        output = b''
        for arg in args:
            result = subprocess.run(arg, capture_output=True)
            logging.info(result.stdout)
            if result.stderr != b'':
                logging.warning(result.stderr)
            if result.returncode == 0:
                output += result.stdout + b"\n\n---\n\n"
            elif result.stderr == b'':
                raise Exception(result.stdout.decode('utf-8'))
            else:
                raise Exception(result.stderr.decode('utf-8'))
        return output

    def reset(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(RESET_GPIO, GPIO.OUT)
        GPIO.output(RESET_GPIO, GPIO.LOW)
        time.sleep(0.1)
        GPIO.output(RESET_GPIO, GPIO.HIGH)
        time.sleep(0.1)
        logging.info("Fortuna-3 is reset.")
        GPIO.cleanup()

    def clean_build(self):
        return self.execute(['make', '-C', COMPUTE_UNIT_DIR, 'clean'])

    def upload_firmware(self):
        return self.execute(['git', '-C', COMPUTE_UNIT_DIR, 'pull'], ['make', '-C', COMPUTE_UNIT_DIR, 'upload'])

    def upload_bios(self, data):
        with open(COMPUTE_UNIT_DIR + "/bios.bin", "wb") as f:
            f.write(data)
        return self.execute(['make', '-C', COMPUTE_UNIT_DIR, 'upload'])

    def format_sdcard(self):
        with FortunaSerialConnection(serial_port, timeout=120) as conn:
            conn.activate_remote()
            conn.send_bytes(b'F')
            conn.check_response()
            conn.deactivate_remote()
        return b'SDCard formatted successfully.'

    def create_file(self, filename, data):
        with FortunaSerialConnection(serial_port, timeout=10) as conn:
            conn.activate_remote()
            conn.send_bytes(b'C')
            conn.send_bytes(len(filename).to_bytes(1, 'little'))
            conn.send_bytes(len(data).to_bytes(4, 'little'))
            conn.send_bytes(bytes(filename, 'utf-8'))
            conn.send_bytes(data)
            conn.check_response()
            conn.deactivate_remote()
        return b'File ' + bytes(filename, 'utf-8') + b' created successfully.'


class RemoteServer(BaseHTTPRequestHandler):

    fortuna3 = FortunaManager()

    def get_request_data(self):
        content_length = int(self.headers['Content-Length'])
        return self.rfile.read(content_length)

    def do_POST(self):
        url = urlparse(self.path)
        try:
            if url.path == '/reset':
                self.fortuna3.reset()
                response  = b'Fortuna-3 is reset.'
            elif url.path == '/upload-bios':
                response = self.fortuna3.upload_bios(self.get_request_data())
            elif url.path == '/format-sdcard':
                response = self.fortuna3.format_sdcard()
            elif url.path.startswith('/create-file'):
                response = self.fortuna3.create_file(url.path.split('/')[2], self.get_request_data())
            elif url.path == '/clean-build':
                response = self.fortuna3.clean_build()
            elif url.path == '/upload-firmware':
                response = self.fortuna3.upload_firmware()
            else:
                self.send_response(404, 'Invalid path')
                self.end_headers()
                return
        except Exception as e:
            self.send_response(500, 'Error processing request')
            self.end_headers()
            self.wfile.write(bytes(str(e) + "\n\n" + traceback.format_exc(), 'utf-8'))
            return

        self.send_response(200)
        self.end_headers()
        self.wfile.write(response)


def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
    s.close()
    return ip


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Usage: ' + sys.argv[0] + ' SERIAL_PORT', file=sys.stderr)
        sys.exit(1)
    serial_port = sys.argv[1]

    GPIO.setmode(GPIO.BCM)
    GPIO.setup(REMOTE_GPIO, GPIO.IN)
    GPIO.setup(RESET_GPIO, GPIO.IN)
    GPIO.cleanup()

    logging.basicConfig(level=logging.INFO)
    httpd = HTTPServer(('', PORT), RemoteServer)
    logging.info('Starting server. IP is ' + get_ip() + '...')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
