#!/usr/bin/env python3
import re
import gzip

def minify_css(css):
    """簡單的CSS壓縮"""
    # 移除註釋
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    # 移除多餘的空白
    css = re.sub(r'\s+', ' ', css)
    # 移除分號前的空格
    css = re.sub(r'\s*;\s*', ';', css)
    # 移除大括號周圍的空格
    css = re.sub(r'\s*{\s*', '{', css)
    css = re.sub(r'\s*}\s*', '}', css)
    # 移除冒號周圍的空格
    css = re.sub(r'\s*:\s*', ':', css)
    return css.strip()

def minify_js(js):
    """簡單的JS壓縮"""
    # 移除單行註釋
    js = re.sub(r'//.*?$', '', js, flags=re.MULTILINE)
    # 移除多行註釋
    js = re.sub(r'/\*.*?\*/', '', js, flags=re.DOTALL)
    # 移除多餘的空白但保留必要的空格
    js = re.sub(r'\s+', ' ', js)
    # 移除行末分號前的空格
    js = re.sub(r'\s*;\s*', ';', js)
    # 移除大括號周圍的空格
    js = re.sub(r'\s*{\s*', '{', js)
    js = re.sub(r'\s*}\s*', '}', js)
    return js.strip()

def create_optimized_html():
    """創建優化的HTML文件"""
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 提取CSS
    css_match = re.search(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
    if css_match:
        css = css_match.group(1)
        minified_css = minify_css(css)
        html = html.replace(css_match.group(0), f'<style>{minified_css}</style>')
    
    # 提取並壓縮JS
    def replace_script(match):
        js = match.group(1)
        if js.strip():
            minified_js = minify_js(js)
            return f'<script>{minified_js}</script>'
        return match.group(0)
    
    html = re.sub(r'<script(?:[^>]*)>(.*?)</script>', replace_script, html, flags=re.DOTALL)
    
    # 移除HTML中的多餘空白（保留內容）
    html = re.sub(r'>\s+<', '><', html)
    html = re.sub(r'\s+', ' ', html)
    
    with open('index-optimized.html', 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"原始文件大小: {len(open('index.html', 'r').read())} bytes")
    print(f"優化文件大小: {len(html)} bytes")
    
    # 創建gzip壓縮版本
    with gzip.open('index-optimized.html.gz', 'wt', encoding='utf-8') as f:
        f.write(html)
    
    with gzip.open('index-optimized.html.gz', 'rb') as f:
        gzip_size = len(f.read())
    
    print(f"Gzip壓縮大小: {gzip_size} bytes")

if __name__ == '__main__':
    create_optimized_html()
