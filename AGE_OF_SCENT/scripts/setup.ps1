Write-Host "Setting up AGE OF SCENT..." -ForegroundColor Cyan

$rootPath = Resolve-Path (Join-Path $PSScriptRoot "..")
$backendPath = Join-Path $rootPath "backend"
$frontendPath = Join-Path $rootPath "frontend"

if (-not (Test-Path $backendPath)) {
    Write-Host "Backend folder not found: $backendPath" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "Frontend folder not found: $frontendPath" -ForegroundColor Red
    exit 1
}

$uploadPaths = @(
    (Join-Path $backendPath "uploads"),
    (Join-Path $backendPath "uploads\ids"),
    (Join-Path $backendPath "uploads\products")
)

foreach ($path in $uploadPaths) {
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path | Out-Null
        Write-Host "Created folder: $path" -ForegroundColor Yellow
    }
}

$gitKeepFiles = @(
    (Join-Path $backendPath "uploads\ids\.gitkeep"),
    (Join-Path $backendPath "uploads\products\.gitkeep")
)

foreach ($file in $gitKeepFiles) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
        Write-Host "Created file: $file" -ForegroundColor Yellow
    }
}

Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
Push-Location $backendPath
npm install
Pop-Location

Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
Push-Location $frontendPath
npm install
Pop-Location

Write-Host "Setup completed." -ForegroundColor Green
Write-Host "Next:" -ForegroundColor Cyan
Write-Host "1. Create your real .env files"
Write-Host "2. Run backend and frontend development servers"
Write-Host "3. Run .\scripts\dev.ps1"