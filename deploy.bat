@echo off
REM ============================================
REM EMPOWER App Deployment Script (Windows)
REM ============================================

echo.
echo ========================================
echo EMPOWER Financial Freedom Application
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo ✓ Node.js detected: 
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo ✓ npm detected: 
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
echo.
call npm install

if errorlevel 1 (
    echo.
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✓ Dependencies installed successfully
echo.

REM Check if .env file exists
if not exist .env (
    echo WARNING: .env file not found!
    echo Please create a .env file with your configuration:
    echo.
    echo   ADMIN_EMAIL=your-email@gmail.com
    echo   EMAIL_SERVICE=gmail
    echo   EMAIL_USER=your-email@gmail.com
    echo   EMAIL_PASSWORD=your-app-password
    echo   SMTP_HOST=smtp.gmail.com
    echo   SMTP_PORT=587
    echo.
    echo For now, starting server without email notifications...
    echo.
)

REM Start the server
echo.
echo ========================================
echo Starting EMPOWER Backend Server
echo ========================================
echo.
echo Server will run on http://localhost:3000
echo Press Ctrl+C to stop the server
echo.

call npm start

pause
