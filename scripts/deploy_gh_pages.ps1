# Deploy AQUAFORGE built frontend directly to gh-pages branch without GitHub Actions
$ErrorActionPreference = "Stop"

Write-Host "=== Building AQUAFORGE Frontend ===" -ForegroundColor Cyan
Set-Location "$PSScriptRoot\..\frontend"
npm run build

Write-Host "=== Preparing gh-pages bundle ===" -ForegroundColor Cyan
Copy-Item "$PSScriptRoot\..\frontend\dist\index.html" "$PSScriptRoot\..\frontend\dist\404.html" -Force
"# disable jekyll" | Out-File -FilePath "$PSScriptRoot\..\frontend\dist\.nojekyll" -Encoding utf8 -Force

$tempDir = Join-Path $env:TEMP "aquaforge-gh-pages-deploy"
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

Copy-Item -Path "$PSScriptRoot\..\frontend\dist\*" -Destination $tempDir -Recurse -Force
Copy-Item -Path "$PSScriptRoot\..\frontend\dist\.nojekyll" -Destination $tempDir -Force

Set-Location $tempDir
git init
git config user.name "Krishna-7772"
git config user.email "krishna@aquaforge.local"
git checkout -b gh-pages
git add .
git commit -m "Deploy AQUAFORGE production prototype to GitHub Pages (direct branch deployment)"

Write-Host "=== Pushing to origin/gh-pages ===" -ForegroundColor Cyan
git remote add origin "https://github.com/Krishna-7772/AquaForge.git"
git push --force origin gh-pages

Set-Location "$PSScriptRoot\.."
Remove-Item -Recurse -Force $tempDir

Write-Host "=== Deployment to gh-pages branch SUCCESSFUL ===" -ForegroundColor Green
Write-Host "URL: https://krishna-7772.github.io/AquaForge/" -ForegroundColor Yellow
