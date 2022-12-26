#!/usr/bin/env python3

import logging
import serial
import socket
import sys
import traceback
import time
import RPi.GPIO as GPIO
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse


PORT = 8026
RESET_GPIO = 8
serial_port = ''


class FortunaSerial:

    @staticmethod
    def connect():
        logging.info('Connecting to serial port: ' + serial_port)
        return serial.Serial(serial_port, baudrate = 1000000, timeout = 2)

    @staticmethod
    def disconnect(ser):
        logging.info('Disconnecting from serial port.')
        ser.close()

    @staticmethod
    def check_response(ser):
        c = ser.read(1)
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

    def reset(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(RESET_GPIO, GPIO.OUT)

        GPIO.output(RESET_GPIO, GPIO.LOW)
        time.sleep(0.1)
        GPIO.output(RESET_GPIO, GPIO.HIGH)
        time.sleep(0.1)
        logging.info("Fortuna-3 is reset.")

        GPIO.cleanup()


class RemoteServer(BaseHTTPRequestHandler):

    fserial = FortunaSerial()

    def reset(self):
        self.fserial.reset()
        return b'Fortuna-3 is reset.'

    def upload_bios(self, data):
        raise Exception('Not implemented yet.')

    def upload_firmware(self):
        raise Exception('Not implemented yet.')

    def format_sdcard(self):
        raise Exception('Not implemented yet.')

    def upload_file(self, filename, data):
        raise Exception('Not implemented yet.')

    def get_request_data(self):
        content_length = int(self.headers['Content-Length'])
        return self.rfile.read(content_length)

    def do_POST(self):
        url = urlparse(self.path)
        try:
            if url.path == '/reset':
                response = self.reset()
            elif url.path == '/upload-bios':
                response = self.upload_bios(self.get_request_data())
            elif url.path == '/upload-firmware':
                response = self.upload_firmware()
            elif url.path == '/format-sdcard':
                response = self.format_sdcard()
            elif url.path.startswith('/create-file'):
                response = self.upload_file(url.path.split('/')[2], self.get_request_data())
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
