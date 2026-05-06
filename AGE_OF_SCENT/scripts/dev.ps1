Write-Host "Starting AGE OF SCENT development..." -ForegroundColor Cyan

$backendPath = Join-Path $PSScriptRoot "..\backend"
$frontendPath = Join-Path $PSScriptRoot "..\frontend"

if (-not (Test-Path $backendPath)) {
    Write-Host "Backend folder not found." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $frontendPath)) {
    Write-Host "Frontend folder not found." -ForegroundColor Red
    exit 1
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; npm run dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; npm run dev"

Write-Host "Backend and frontend started in separate terminals." -ForegroundColor Green