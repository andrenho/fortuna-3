#!/usr/bin/env python3
import argparse
import json
import webbrowser
from pathlib import Path
from http.server import BaseHTTPRequestHandler, HTTPServer

FILES = [
    '/index.html',
    '/js/Z80.js',
    '/components/common.js',
    '/components/flat-data.js', '/components/memory-stack.js', '/components/debug-assembly.js',
    '/components/command-button.js', '/components/register-box.js',
    '/data/ShareTechMono-Regular.ttf',
]


#
# COMMANDLINE ARGUMENTS
#

parser = argparse.ArgumentParser(description='Fortuna3 emulator')
parser.add_argument('project_path', help='Path of the project file', nargs='?')
parser.add_argument('-d', '--dev', action='store_true', help='Development mode')
parser.add_argument('-s', '--sdcard', action='store', type=str)
args = parser.parse_args()


#
# COMPILATION
#

#
# SERVICE
#

class FortunaService:

    def debug(self):
        pass


#
# WEB SERVER
#

class HTTPHandler(BaseHTTPRequestHandler):
    fortuna = FortunaService()

    def call_service(self, path):
        if self.path.startswith('/api/debug'):
            return self.fortuna.debug()
        raise Exception("Invalid path " + path)

    def do_GET(self):
        if self.path.startswith('/api'):
            try:
                result = self.call_service(self.path)
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(bytes(json.dumps(result), 'utf-8'))

            except Exception as e:
                self.send_response(500, str(e))
                self.end_headers()

        elif self.path == '/' or self.path in FILES:
            filename = self.path[1:] if self.path != '/' else 'index.html'

            if args.dev:
                self.serve_local_file(filename)
            else:
                self.serve_embedded_file(filename)

        else:
            self.send_response(404, 'Resource not found')
            self.end_headers()

    def serve_local_file(self, filename):
        self.send_response(200)
        if filename.endswith('.html'):
            self.send_header('Content-type', 'text/html')
        elif filename.endswith('.css'):
            self.send_header('Content-type', 'text/css')
        elif filename.endswith('.js'):
            self.send_header('Content-type', 'text/javascript')
        else:
            self.send_header('Content-type', 'application/octet-stream')
        self.end_headers()

        self.wfile.write(Path('frontend/' + filename).read_bytes())

    def serve_embedded_file(self, filename):
        self.send_response(501)
        self.wfile.write(b'Not implemented yet.')   # TODO


if not args.dev:
    webbrowser.open('http://localhost:8024/')

with HTTPServer(('', 8024), HTTPHandler) as server:
    server.serve_forever()
