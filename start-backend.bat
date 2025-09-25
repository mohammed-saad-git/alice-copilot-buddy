@echo off
REM start-backend.bat — placed next to Alice AI.exe by the installer
cd /d "%~dp0"

REM Try to use python from PATH
echo Starting backend...
python "%~dp0\api_server.py" 1>backend_stdout.log 2>backend_stderr.log
if %ERRORLEVEL% neq 0 (
  echo Failed to start backend. Make sure Python 3.x is installed and on PATH.
  pause
)
