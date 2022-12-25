#!/usr/bin/env python3

import logging
import socket
import sys
import traceback
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

import serial

PORT = 8026
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
        ser = self.connect()
        try:
            logging.info('Sending reset...')
            ser.write(b"\xfe")
            ser.write(b"\xf0")
            ser.write(b"\xff")
            # self.check_response(ser)
        finally:
            self.disconnect(ser)


class RemoteServer(BaseHTTPRequestHandler):

    fserial = FortunaSerial()

    def reset(self):
        self.fserial.reset()
        return b'Reset successful.'

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


if __name__ == '__main__':
    if len(sys.argv) != 2:
        print('Usage: ' + sys.argv[0] + ' SERIAL_PORT', file=sys.stderr)
        sys.exit(1)
    serial_port = sys.argv[1]

    logging.basicConfig(level=logging.INFO)
    '''
    httpd = HTTPServer(('', PORT), RemoteServer)
    hostname = socket.gethostname()
    logging.info('Starting server. IP is ' + socket.gethostbyname(hostname) + '...')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    '''
    f = FortunaSerial()
    f.reset()
