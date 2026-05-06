Write-Host "Cleaning AGE OF SCENT project..." -ForegroundColor Cyan

$paths = @(
    "backend/node_modules",
    "frontend/node_modules",
    "backend/dist",
    "frontend/.next",
    "frontend/out",
    "coverage",
    ".temp",
    ".tmp"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Remove-Item $path -Recurse -Force
        Write-Host "Removed: $path" -ForegroundColor Yellow
    } else {
        Write-Host "Skipped: $path" -ForegroundColor DarkGray
    }
}

Write-Host "Clean finished." -ForegroundColor Green