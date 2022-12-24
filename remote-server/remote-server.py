#!/usr/bin/env python3

import logging
import socket
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

PORT = 8026


class RemoteServer(BaseHTTPRequestHandler):

    def reset(self):
        return b'Reset successful.'

    def upload_bios(self, data):
        print(data)
        return b'BIOS upload successful.'

    def upload_firmware(self):
        return b'Firmware upload successful.'

    def format_sdcard(self):
        raise Exception("Error formatting SDCard")

    def upload_file(self, filename, data):
        print(filename, data)
        return b'File upload successful.'

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
    logging.basicConfig(level=logging.INFO)
    httpd = HTTPServer(('', PORT), RemoteServer)
    hostname = socket.gethostname()
    logging.info('Starting server. IP is ' + socket.gethostbyname(hostname) + '...')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
