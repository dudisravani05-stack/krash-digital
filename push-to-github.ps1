#!/usr/bin/env powershell
# Quick push to GitHub script

$git = "C:\Program Files\Git\bin\git.exe"
$repoUrl = "https://github.com/dudisravani05-stack/krash-digital.git"

Write-Host "🚀 Krash Digital - Quick GitHub Push" -ForegroundColor Green
Write-Host "=====================================`n" -ForegroundColor Green

Write-Host "Step 1: Adding remote repository..." -ForegroundColor Cyan
& $git remote add origin $repoUrl 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Remote added`n" -ForegroundColor Green
} else {
    Write-Host "ℹ Remote already exists (that's okay)`n" -ForegroundColor Yellow
}

Write-Host "Step 2: Renaming branch to main..." -ForegroundColor Cyan
& $git branch -M main
Write-Host "✓ Branch renamed to main`n" -ForegroundColor Green

Write-Host "Step 3: Pushing to GitHub..." -ForegroundColor Cyan
& $git push -u origin main
Write-Host "`n✓ Push complete!`n" -ForegroundColor Green

Write-Host "✨ Your code is now on GitHub!" -ForegroundColor Green
Write-Host "Next: Go to https://vercel.com/new and deploy`n" -ForegroundColor Cyan
