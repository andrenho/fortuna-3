#!/usr/bin/env python3

import logging
import socket
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

import serial
import sys

PORT = 8026
serial_port = ''


class FortunaSerial:

    @staticmethod
    def connect():
        return serial.Serial(serial_port, baudrate = 1000000, timeout = 0.5)

    @staticmethod
    def disconnect(ser):
        ser.close()

    @staticmethod
    def check_response(ser):
        c = ser.read(1)
        if (c[0] != 0):
            raise Exception("Error communicating with Fortuna-3")

    def reset(self):
        ser = self.connect()
        try:
            ser.write(b"\xfe\xf0\xff")
            self.check_response(ser)
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
            self.wfile.write(bytes(str(e), 'utf-8'))
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
    httpd = HTTPServer(('', PORT), RemoteServer)
    hostname = socket.gethostname()
    logging.info('Starting server. IP is ' + socket.gethostbyname(hostname) + '...')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
