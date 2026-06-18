@echo off
cd /d "c:\Users\ASUS\Downloads\krash-digital"

echo Initializing Git repository...
git init

echo Adding all files...
git add .

echo Creating initial commit...
git commit -m "Initial commit: Krash Digital project"

echo.
echo Git setup complete!
echo.
echo Next steps:
echo 1. Go to https://github.com/dudisravani05-stack
echo 2. Create a new repository named 'krash-digital'
echo 3. Copy the repository URL
echo 4. Run this command in PowerShell or cmd:
echo    git remote add origin [YOUR_GITHUB_URL]
echo    git branch -M main
echo    git push -u origin main
echo.
echo Then deploy to Vercel at https://vercel.com
pause
