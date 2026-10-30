@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo ==========================================
echo   site_02 start
echo ==========================================
if not exist "node_modules" (
  echo [1/2] npm install ...
  call npm.cmd install
  if errorlevel 1 (
    echo.
    echo [ERROR] npm install failed. Copy the red messages above and send them.
    pause
    exit /b 1
  )
)
echo [2/2] npm run dev ...
echo Open http://localhost:3000 in your browser. Do NOT close this window.
start "" cmd /c "timeout /t 8 >NUL & start http://localhost:3000"
call npm.cmd run dev
pause
