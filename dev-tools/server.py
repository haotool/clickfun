#!/usr/bin/env python3
import http.server
import socketserver
import gzip
import os
import mimetypes
from pathlib import Path

class GzipHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # 添加安全頭
        self.send_header('Content-Security-Policy', 
                        "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self' data:; img-src 'self' data: blob:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self';")
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        self.send_header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
        super().end_headers()

    def do_GET(self):
        # 檢查瀏覽器是否支援 gzip
        accept_encoding = self.headers.get('Accept-Encoding', '')
        
        # 獲取要請求的文件路徑
        if self.path == '/':
            path = 'index.html'
        else:
            path = self.path.lstrip('/')
        
        # 確保文件存在
        if not os.path.exists(path):
            super().do_GET()
            return
        
        # 檢查是否應該壓縮
        mime_type, _ = mimetypes.guess_type(path)
        compressible_types = [
            'text/html', 'text/css', 'text/javascript', 'application/javascript',
            'text/plain', 'application/json', 'text/xml', 'application/xml'
        ]
        
        should_compress = (
            'gzip' in accept_encoding and 
            mime_type in compressible_types and
            os.path.getsize(path) > 1024  # 只壓縮大於1KB的文件
        )
        
        if should_compress:
            # 讀取文件並壓縮
            with open(path, 'rb') as f:
                content = f.read()
            
            compressed_content = gzip.compress(content)
            
            self.send_response(200)
            self.send_header('Content-Type', mime_type)
            self.send_header('Content-Encoding', 'gzip')
            self.send_header('Content-Length', str(len(compressed_content)))
            self.send_header('Cache-Control', 'public, max-age=31536000' if path.startswith('fonts/') or path.startswith('images/') else 'public, max-age=3600')
            self.end_headers()
            self.wfile.write(compressed_content)
        else:
            # 使用原始處理器
            super().do_GET()

PORT = 5500
Handler = GzipHTTPRequestHandler

print(f"Starting server on port {PORT} with gzip compression...")
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
