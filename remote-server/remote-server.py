#!/usr/bin/env python3

import logging
import socket
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = 8026


class RemoteServer(BaseHTTPRequestHandler):

    def do_POST(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b'Reset successful.')


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
