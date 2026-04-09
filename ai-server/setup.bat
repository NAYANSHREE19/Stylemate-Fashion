@echo off
REM ══════════════════════════════════════════════════
REM  StyleMate AI Server — Windows Setup Script
REM  Run this ONCE to create the venv + install deps
REM ══════════════════════════════════════════════════

echo [1/4] Creating Python virtual environment (.venv312)...
python -m venv .venv312

echo [2/4] Upgrading pip inside venv...
.venv312\Scripts\python.exe -m pip install --upgrade pip

echo [3/4] Installing dependencies (CPU torch by default)...
.venv312\Scripts\pip.exe install -r requirements.txt

echo.
echo [4/4] Done!
echo.
echo  ────────────────────────────────────────────────
echo  To start the AI server, run:
echo      start_server.bat
echo.
echo  For GPU support (CUDA 12.1), run:
echo      .venv312\Scripts\pip.exe install torch==2.2.2 torchvision --index-url https://download.pytorch.org/whl/cu121
echo  ────────────────────────────────────────────────
pause
