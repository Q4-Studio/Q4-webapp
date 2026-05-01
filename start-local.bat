@echo off
setlocal

cd /d "%~dp0"

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

echo Starting Q4 Studio locally...
start "Q4 Studio Dev Server" cmd /k "npm run dev -- --host 0.0.0.0"

timeout /t 3 /nobreak > nul
start "" "http://localhost:5173"

echo Local site opened at http://localhost:5173
