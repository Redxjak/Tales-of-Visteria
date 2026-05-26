# -*- mode: python ; coding: utf-8 -*-

import re


def app_version():
    with open('game.py', encoding='utf-8') as game_file:
        match = re.search(r'APP_VERSION\s*=\s*"([^"]+)"', game_file.read())
    if not match:
        raise RuntimeError('APP_VERSION was not found in game.py')
    return match.group(1)


APP_VERSION = app_version()

a = Analysis(
    ['game.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('monster_stats.json', '.'),
        ('game_over_party.png', '.'),
        ('translations', 'translations'),
    ],
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name=f'TalesofVisteria-v{APP_VERSION}',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
