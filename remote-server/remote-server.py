#!/usr/bin/env python3

import logging
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
serial_port = ''


class FortunaSerialConnection:

    def __init__(self, port):
        self.port = port

    def __enter__(self):
        logging.info('Connecting to serial port: ' + self.port)
        self.ser = serial.Serial(self.port, baudrate = 1000000, timeout = 2)

    def __exit__(self, *args):
        logging.info('Disconnecting from serial port.')
        self.ser.close()

    def check_response(self):
        c = self.ser.read(1)
        if len(c) < 1:
            raise Exception("No response received")
        logging.info('Response received: ' + str(int(c[0])))
        if (c[0] == 1):
            raise Exception("Generic error while communicating");
        elif (c[0] == 2):
            raise Exception("Error: file too large")
        elif (c[0] == 3):
            raise Exception("Error: SDCard access error")
        elif (c[0] == 4):
            raise Exception("Error: invalid command")
        elif (c[0] > 0):
            raise Exception("Unknown error")

    def activate_remote(self):
        self.ser.write(0xfe)
        self.ser.write(0xf0)

    def send_command(self, *args):
        for arg in args:
            self.ser.write(arg)
        self.check_response()

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
        return self.execute(['make', '-C', '../compute-unit', 'clean'])

    def upload_firmware(self):
        return self.execute(['git', '-C', '../compute-unit', 'pull'], ['make', '-C', '../compute-unit', 'upload'])

    def upload_bios(self, data):
        with open("../compute-unit/bios.bin", "wb") as f:
            f.write(data)
        return self.execute(['make', '-C', '../compute-unit', 'upload'])

    def format_sdcard(self):
        with FortunaSerialConnection(serial_port) as conn:
            conn.activate_remote()
            conn.send_command(0x2, timeout=60)
        return b'SDCard formatted successfully.'


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
            elif url.path == '/format-sdcard':
                raise Exception('Not implemented yet.')
            elif url.path.startswith('/create-file'):
                # response = self.upload_file(url.path.split('/')[2], self.get_request_data())
                raise Exception('Not implemented yet.')
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

    logging.basicConfig(level=logging.INFO)
    httpd = HTTPServer(('', PORT), RemoteServer)
    logging.info('Starting server. IP is ' + get_ip() + '...')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
