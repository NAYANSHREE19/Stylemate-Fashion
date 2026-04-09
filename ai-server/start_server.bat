@echo off
REM ══════════════════════════════════════════════════
REM  StyleMate AI Server — Start Script
REM ══════════════════════════════════════════════════

echo Starting StyleMate AI Server on http://localhost:8000 ...
echo (First run will download the SDXL Turbo model ~6 GB)
echo.

.venv312\Scripts\uvicorn.exe ai_server:app --host 0.0.0.0 --port 8000 --workers 1
pause
