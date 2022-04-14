#!/usr/bin/env python3
import argparse
import json
import webbrowser
from pathlib import Path
from http.server import BaseHTTPRequestHandler, HTTPServer

#
# COMMANDLINE ARGUMENTS
#

parser = argparse.ArgumentParser(description='Fortuna3 emulator')
parser.add_argument('project_path', help='Path of the project file')
parser.add_argument('-d', '--debug', action='store_true', help='Development mode, assumes frontend running from somewhere else.')
parser.add_argument('-s', '--sdcard', action='store', type=str)

#
# COMPILATION
#

#
# SERVICE
#

class FortunaService:
    pass


#
# WEB SERVER
#

class HTTPHandler(BaseHTTPRequestHandler):
    fortuna = FortunaService()

    def call_service(self, path):
        return {'hello': 'world'}

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

        elif self.path in ['/', '/index.html', '/fortuna3.css', '/fortuna3.js', '/debugger.js', '/Z80.js']:
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()

            filename = self.path[1:] if self.path != '/' else 'index.html'
            content = Path('frontend/' + filename).read_text()
            self.wfile.write(bytes(content, 'utf-8'))

        else:
            self.send_response(404, 'Resource not found')
            self.end_headers()


#webbrowser.open('http://localhost:8024/')
with HTTPServer(('', 8024), HTTPHandler) as server:
    server.serve_forever()
