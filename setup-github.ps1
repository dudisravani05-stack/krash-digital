$git = "C:\Program Files\Git\bin\git.exe"
$projectPath = "c:\Users\ASUS\Downloads\krash-digital"

cd $projectPath

Write-Host "🚀 Initializing Git repository for Krash Digital..." -ForegroundColor Green
& $git init

Write-Host "`n📝 Adding all files..." -ForegroundColor Green
& $git add .

Write-Host "`n💾 Creating initial commit..." -ForegroundColor Green
& $git commit -m "Initial commit: Krash Digital project

- Removed Google AI Studio references
- Updated project title to Krash Digital
- Ready for GitHub and Vercel deployment"

Write-Host "`n✅ Git initialization complete!" -ForegroundColor Green
Write-Host "`n📋 Repository Status:" -ForegroundColor Cyan
& $git status

Write-Host "`n📌 NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1️⃣  Go to https://github.com/dudisravani05-stack" -ForegroundColor White
Write-Host "2️⃣  Create a new repository named 'krash-digital'" -ForegroundColor White
Write-Host "3️⃣  Copy the repository HTTPS URL" -ForegroundColor White
Write-Host "4️⃣  Run these commands in PowerShell:" -ForegroundColor White
Write-Host "`n    git remote add origin [YOUR_GITHUB_URL]" -ForegroundColor Cyan
Write-Host "    git branch -M main" -ForegroundColor Cyan
Write-Host "    git push -u origin main" -ForegroundColor Cyan
Write-Host "`n5️⃣  Then deploy to Vercel at https://vercel.com" -ForegroundColor White
Write-Host "    - Connect your GitHub repo" -ForegroundColor White
Write-Host "    - Framework: Vite" -ForegroundColor White
Write-Host "    - Deploy!" -ForegroundColor White
