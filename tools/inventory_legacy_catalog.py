#!/usr/bin/env python3
"""Generate a source inventory, not a runtime compatibility certification."""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
CLIENT = ROOT / 'engine/upstream/src/com/lushprojects/circuitjs1/client'
OUT = ROOT / 'build/audit'


def main():
    menu_text = (CLIENT / 'Menus.java').read_text()
    menu_classes = sorted(set(re.findall(r'"(\w+Elm)"', menu_text)))
    classes = {}
    for path in sorted(CLIENT.glob('*Elm.java')):
        source = re.sub(r'/\*.*?\*/|//[^\n]*', '', path.read_text(), flags=re.S)
        match = re.search(r'class\s+(\w+)\s+extends\s+(\w+)', source)
        if not match:
            continue
        dump = re.search(r'int\s+getDumpType\s*\(\s*\)\s*\{\s*return\s+(\d+|\x27.\x27)\s*;', source)
        token = dump[1].strip("'") if dump else None
        classes[match[1]] = {'parent': match[2], 'ownDumpType': token,
                             'menuEntry': match[1] in menu_classes,
                             'source': str(path.relative_to(ROOT))}

    def dump_type(name, seen=None):
        seen = set() if seen is None else seen
        if name not in classes or name in seen:
            return None
        seen.add(name)
        return classes[name]['ownDumpType'] or dump_type(classes[name]['parent'], seen)

    for name, item in classes.items():
        item['dumpType'] = dump_type(name)
    OUT.mkdir(parents=True, exist_ok=True)
    data = {'classes': classes, 'menuClasses': menu_classes}
    report = OUT / 'legacy-classes.json'
    report.write_text(json.dumps(data, indent=2) + '\n')
    print(f'Inventoried {len(menu_classes)} menu classes in {report}')


if __name__ == '__main__':
    main()
