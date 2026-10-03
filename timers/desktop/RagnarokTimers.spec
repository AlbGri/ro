# -*- mode: python ; coding: utf-8 -*-
# PyInstaller spec per Ragnarok Timers
# Build: pyinstaller RagnarokTimers.spec --noconfirm
# Nota: il file ragnarok_timers.json viene creato accanto all'exe al primo salvataggio

import sys
from pathlib import Path

# Negli environment conda le DLL native stanno in Library/bin, che PyInstaller
# non ispeziona: senza di esse il bundle contiene i moduli di estensione ma
# l'exe muore all'avvio con "DLL load failed while importing _tkinter" o
# "... _ctypes". La lista e' stata ricavata leggendo con pefile la tabella di
# import dei .pyd finiti nel bundle, non a tentativi.
DLL_RICHIESTE = ("tcl86t.dll", "tk86t.dll", "ffi.dll")
DLL_OPZIONALI = ("libbz2.dll", "liblzma.dll", "libexpat.dll")

binaries = []
conda_bin = Path(sys.prefix) / "Library" / "bin"
if conda_bin.is_dir():
    mancanti = []
    for dll_name in DLL_RICHIESTE:
        dll_path = conda_bin / dll_name
        if dll_path.exists():
            binaries.append((str(dll_path), "."))
        else:
            mancanti.append(dll_name)
    # Meglio fermare la build che consegnare un eseguibile che non parte.
    if mancanti:
        raise SystemExit(f"DLL non trovate in {conda_bin}: {mancanti}")
    for dll_name in DLL_OPZIONALI:
        dll_path = conda_bin / dll_name
        if dll_path.exists():
            binaries.append((str(dll_path), "."))

a = Analysis(
    ["ragnarok_timers.py", "timers_core.py"],
    pathex=[],
    binaries=binaries,
    datas=[],
    hiddenimports=[
        "timers_core",
        # Importato solo dentro una funzione, PyInstaller non lo rileva.
        "winsound",
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        # tkinter serve: non va escluso.
        "matplotlib",
        "numpy",
        "pandas",
        "scipy",
        "PIL",
        "pytest",
        "setuptools",
        "unittest",
    ],
    noarchive=False,
    optimize=0,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name="RagnarokTimers",
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name="RagnarokTimers",
)
