@echo off
title Build Ferghana Davomat Desktop .exe Installer
echo ===================================================
echo Building Ferghana Davomat & Telegram Desktop (.exe)
echo ===================================================
cd /d "%~dp0"
echo 1. Installing dependencies...
npm install
echo.
echo 2. Packaging .exe Installer...
npx electron-builder --win nsis
echo.
echo ===================================================
echo DONE! The .exe setup file is inside desktop_app\dist\
echo ===================================================
pause
