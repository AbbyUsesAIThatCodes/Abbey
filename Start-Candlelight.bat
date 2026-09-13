@echo off
setlocal
if not exist "%~dp0Candlelight.html" (
  echo Candlelight.html is missing. Please fetch the full Candlelight branch.
  pause
  exit /b 1
)
start "" "%~dp0Candlelight.html"
endlocal
