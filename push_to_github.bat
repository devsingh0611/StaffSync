@echo off
echo ========================================================
echo        StaffSync - Push to GitHub Helper
echo ========================================================
echo.
set /p REPO_URL="Enter your GitHub repository URL (e.g., https://github.com/username/StaffSync.git): "

if "%REPO_URL%"=="" (
    echo Error: Repository URL cannot be empty.
    pause
    exit /b
)

echo.
echo Configuring remote origin...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo Pushing code to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo  Success! StaffSync has been deployed to GitHub!
    echo ========================================================
) else (
    echo.
    echo Pushing failed. Please check your credentials or repo permissions.
)

pause
