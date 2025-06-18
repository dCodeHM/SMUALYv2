@echo off
echo Building Excel Comparison Tool...
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
)

REM Build the application
echo Building application...
npm run build

echo.
echo Build completed successfully!
echo.
echo The application is ready for deployment.
echo Files are located in the 'dist' folder.
echo.
echo To deploy:
echo 1. Upload the contents of 'dist' folder to your web server
echo 2. Or use Docker: docker build -t excel-comparison-tool .
echo.
pause 