@echo off
title StaffSync GitHub Deployment
echo ========================================================
echo        StaffSync - Push to GitHub Repository
echo ========================================================
echo Remote URL: https://github.com/devsingh0611/StaffSync.git
echo Branch:     main
echo ========================================================
echo.
echo Pushing your complete code to GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo  SUCCESS! StaffSync successfully deployed to GitHub!
    echo  View repository: https://github.com/devsingh0611/StaffSync
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo  Push was not completed.
    echo  If prompted, please complete browser login to GitHub.
    echo ========================================================
)

echo.
pause
