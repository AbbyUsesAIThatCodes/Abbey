#!/usr/bin/env python3
"""One build entry point for the pure C++ core and optional native desktop client."""
import argparse
from pathlib import Path
import platform
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def run(command, **kwargs):
    print(' '.join(map(str, command)), flush=True)
    subprocess.run(list(map(str, command)), cwd=ROOT, check=True, **kwargs)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--desktop', action='store_true', help='Build and test the Godot extension')
    parser.add_argument('--package', action='store_true', help='Also export a standalone desktop game')
    parser.add_argument('--godot', help='Path to a Godot 4.4.1 executable; otherwise download official tools')
    parser.add_argument('--templates', help='Directory containing official release export templates')
    parser.add_argument('--build-dir', default='build')
    parser.add_argument('--jobs', type=int, default=4)
    args = parser.parse_args()
    desktop = args.desktop or args.package
    build = ROOT / args.build_dir
    cmake = shutil.which('cmake')
    ctest = shutil.which('ctest')
    if not cmake or not ctest:
        raise SystemExit('Install CMake and a C++20 compiler first. See README.md.')
    command = [cmake, '-S', ROOT, '-B', build, '-DCMAKE_BUILD_TYPE=Release', '-DABBEY_BUILD_GODOT=' + ('ON' if desktop else 'OFF')]
    run(command)
    run([cmake, '--build', build, '--config', 'Release', '--parallel', args.jobs])
    run([ctest, '--test-dir', build, '-C', 'Release', '--output-on-failure'])
    if not desktop:
        return
    if args.godot:
        godot = Path(args.godot).resolve()
    else:
        from setup_godot import install
        godot = install()
    validate([godot, '--headless', '--path', ROOT/'godot', '--editor', '--import'])
    validate([godot, '--headless', '--path', ROOT/'godot', '--script', 'res://scripts/test_native.gd'])
    validate([godot, '--headless', '--path', ROOT/'godot', '--script', 'res://scripts/test_ui.gd', '--', '--fresh'])
    validate([godot, '--headless', '--path', ROOT/'godot', '--quit-after', '30', '--', '--fresh'])
    if args.package:
        package(godot, args.templates)


def validate(command):
    result = subprocess.run(list(map(str, command)), cwd=ROOT, text=True, encoding="utf-8", errors="replace", stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=180)
    print(result.stdout)
    if result.returncode or 'SCRIPT ERROR:' in result.stdout or '\nERROR:' in result.stdout:
        raise SystemExit('Godot validation failed')


def package(godot, templates):
    system = platform.system()
    template_dir = Path(templates).resolve() if templates else ROOT/'.cache/godot/templates'
    name = 'Windows Desktop' if system == 'Windows' else 'Linux'
    template = template_dir / ('windows_release_x86_64.exe' if system == 'Windows' else 'linux_release.x86_64')
    if not template.exists():
        raise SystemExit('Missing export template. Run scripts/setup_godot.py or pass --templates.')
    folder = ROOT / 'dist' / ('Abbey-Windows' if system == 'Windows' else 'Abbey-Linux')
    folder.mkdir(parents=True, exist_ok=True)
    output = folder / ('Abbey.exe' if system == 'Windows' else 'Abbey.x86_64')
    # A custom preset lives in an ignored file; no machine-specific paths are committed.
    preset = f'''[preset.0]
name="{name}"
platform="{name}"
runnable=true
export_filter="all_resources"
include_filter=""
exclude_filter="scripts/test_*.gd"
export_path="{output.as_posix()}"
[preset.0.options]
custom_template/release="{template.as_posix()}"
binary_format/embed_pck=true
texture_format/s3tc_bptc=true
texture_format/etc2_astc=false
codesign/enable=false
application/modify_resources=false
'''
    (ROOT/'godot/export_presets.cfg').write_text(preset, encoding='utf-8')
    validate([godot, '--headless', '--path', ROOT/'godot', '--export-release', name, output])
    validate([output, '--headless', '--quit-after', '30', '--', '--fresh'])
    shutil.copy(ROOT/'docs/Player-Guide.md', folder/'READ-ME.md')
    shutil.copy(ROOT/'THIRD_PARTY.md', folder/'THIRD_PARTY.md')
    shutil.copytree(ROOT/'docs/licenses', folder/'licenses', dirs_exist_ok=True)
    if system == 'Linux':
        output.chmod(0o755)
        launch=folder/'Start-Abbey.sh'
        launch.write_text('#!/bin/sh\ncd "$(dirname "$0")" || exit 1\nexec ./Abbey.x86_64 "$@"\n')
        launch.chmod(0o755)
    shutil.make_archive(str(folder), 'zip', root_dir=folder)
    print('Packaged:', folder.with_suffix('.zip'))


if __name__ == '__main__':
    main()
