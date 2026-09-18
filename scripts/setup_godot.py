#!/usr/bin/env python3
"""Install pinned, official Godot tools into an ignored project-local directory."""
import argparse
import os
from pathlib import Path
import platform
import urllib.request
import zipfile

VERSION = '4.4.1-stable'
ROOT = Path(__file__).resolve().parents[1]


def install():
    system = platform.system()
    suffix = {'Linux': 'linux.x86_64', 'Windows': 'win64.exe'}.get(system)
    if suffix is None:
        raise SystemExit('This milestone packages Windows x64 and Linux x64. Install Godot manually elsewhere.')
    target = ROOT / '.cache' / 'godot'
    target.mkdir(parents=True, exist_ok=True)
    executable = target / f'Godot_v{VERSION}_{suffix}'
    assets = [f'Godot_v{VERSION}_{suffix}.zip', f'Godot_v{VERSION}_export_templates.tpz']
    for asset in assets:
        archive = target / asset
        if not archive.exists():
            partial = archive.with_suffix('.download')
            print(f'Downloading official {asset}', flush=True)
            urllib.request.urlretrieve(f'https://github.com/godotengine/godot-builds/releases/download/{VERSION}/{asset}', partial)
            partial.replace(archive)
        with zipfile.ZipFile(archive) as z:
            if asset.endswith('.tpz'):
                names = ['templates/version.txt', 'templates/linux_release.x86_64', 'templates/windows_release_x86_64.exe']
            else:
                names = [n for n in z.namelist() if n.endswith(suffix)]
            for name in names:
                destination = (target / name).resolve()
                if not destination.is_relative_to(target.resolve()):
                    raise SystemExit('Unsafe archive member')
                if not destination.exists():
                    z.extract(name, target)
    executable.chmod(0o755)
    print(executable)
    return executable


if __name__ == '__main__':
    install()
