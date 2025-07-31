@echo off
echo.
echo ========================================
echo    Pushing to GitHub...
echo ========================================
echo.

echo Adding all changes...
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo Committing changes...
"C:\Program Files\Git\bin\git.exe" commit -m "Update Bon System"

echo.
echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push

echo.
echo ========================================
echo    Done! Changes pushed to GitHub.
echo ========================================
echo.
pause 