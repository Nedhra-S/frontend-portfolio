#!/usr/bin/env python3
"""Re-creates assets/sources.js from every file in q/.
Run this after editing a question file if you open the site directly from disk (file://).
When the site is served by a local web server (Question 1) the viewer reads the live files instead."""
import json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
files = {}
for p in sorted((root / 'q').iterdir()):
    if p.suffix in ('.html', '.css', '.js'):
        files[p.name] = p.read_text(encoding='utf-8')
(root / 'assets' / 'sources.js').write_text('window.SOURCES = ' + json.dumps(files, ensure_ascii=False) + ';\n', encoding='utf-8')
print('sources.js written with', len(files), 'files')
