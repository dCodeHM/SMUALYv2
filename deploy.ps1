Write-Host "Building Excel Comparison Tool..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Build failed" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Build completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "The application is ready for deployment." -ForegroundColor Cyan
Write-Host "Files are located in the 'dist' folder." -ForegroundColor Cyan
Write-Host ""
Write-Host "Deployment options:" -ForegroundColor Yellow
Write-Host "1. Static hosting: Upload contents of 'dist' folder to your web server" -ForegroundColor White
Write-Host "2. Docker: docker build -t excel-comparison-tool ." -ForegroundColor White
Write-Host "3. Local preview: npm run preview" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") 