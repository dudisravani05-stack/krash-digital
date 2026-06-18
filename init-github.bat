@echo off
setlocal enabledelayedexpansion

set GIT="C:\Program Files\Git\bin\git.exe"
set PROJECT=c:\Users\ASUS\Downloads\krash-digital

cd /d "%PROJECT%"

echo.
echo ============================================
echo   Krash Digital - GitHub Setup
echo ============================================
echo.

echo Initializing Git repository...
%GIT% init

echo.
echo Adding all files...
%GIT% add .

echo.
echo Creating initial commit...
%GIT% commit -m "Initial commit: Krash Digital project"

echo.
echo ✓ Git initialization complete!
echo.
echo Repository Status:
%GIT% status

echo.
echo ============================================
echo   NEXT STEPS
echo ============================================
echo.
echo 1. Go to https://github.com/dudisravani05-stack
echo 2. Create a new repository named 'krash-digital'
echo 3. Copy the HTTPS URL from GitHub
echo 4. Run in PowerShell:
echo.
echo    $git = "C:\Program Files\Git\bin\git.exe"
echo    & $git remote add origin [YOUR_GITHUB_URL]
echo    & $git branch -M main
echo    & $git push -u origin main
echo.
echo 5. Deploy to Vercel at https://vercel.com
echo    - Connect your GitHub repo
echo    - Framework: Vite
echo    - Deploy!
echo.
echo ============================================
echo.
pause
