#!/usr/bin/env python3
"""Turn a pasted cookie header + localStorage dump into a Playwright storageState.

    python3 session.py paste.json session.json

paste.json is what the product owner hands over (see README → "Getting a session"):
    { "cookie": "<the Cookie request header, verbatim>",
      "ls": { "<localStorage key>": "<value>", ... } }

The output is a logged-in session for yarmill.mjs. Both files are gitignored and
should be chmod 600; delete them when the shoot is done.
"""
import json
import os
import sys

src = sys.argv[1] if len(sys.argv) > 1 else 'paste.json'
dst = sys.argv[2] if len(sys.argv) > 2 else 'session.json'
raw = json.load(open(src))

cookies = []
for part in raw['cookie'].split('; '):
    name, _, value = part.partition('=')
    cookies.append({'name': name, 'value': value, 'domain': 'we.yarmill.com', 'path': '/',
                    'expires': -1, 'httpOnly': False, 'secure': True, 'sameSite': 'Lax'})
state = {
    'cookies': cookies,
    'origins': [{'origin': 'https://we.yarmill.com',
                 'localStorage': [{'name': k, 'value': v} for k, v in raw.get('ls', {}).items()]}],
}
with open(dst, 'w') as f:
    json.dump(state, f)
os.chmod(dst, 0o600)
print(f'{dst}: cookies {[c["name"] for c in cookies]}, localStorage {list(raw.get("ls", {}))}')
