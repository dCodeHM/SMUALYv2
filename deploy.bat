@echo off
echo Building Excel Comparison Tool...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

REM Build the application
echo Building application...
npm run build
if %errorlevel% neq 0 (
    echo Error: Build failed
    pause
    exit /b 1
)

echo.
echo Build completed successfully!
echo.
echo The application is ready for deployment.
echo Files are located in the 'dist' folder.
echo.
echo Deployment options:
echo 1. Static hosting: Upload contents of 'dist' folder to your web server
echo 2. Docker: docker build -t excel-comparison-tool .
echo 3. Local preview: npm run preview
echo.
pause 