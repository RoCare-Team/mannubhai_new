param(
    [string]$projectPath = "."
)

Write-Host "Clearing Next.js cache..." -ForegroundColor Cyan

# Delete Next.js cache
if (Test-Path "$projectPath\.next\cache") {
    Remove-Item -Recurse -Force "$projectPath\.next\cache"
    Write-Host "✅ Cleared .next/cache" -ForegroundColor Green
} else {
    Write-Host "⚠️ .next/cache not found" -ForegroundColor Yellow
}

# Delete Node modules cache
if (Test-Path "$projectPath\node_modules\.cache") {
    Remove-Item -Recurse -Force "$projectPath\node_modules\.cache"
    Write-Host "✅ Cleared node_modules/.cache" -ForegroundColor Green
} else {
    Write-Host "⚠️ node_modules/.cache not found" -ForegroundColor Yellow
}

Write-Host "Cache clearing complete!" -ForegroundColor Cyan