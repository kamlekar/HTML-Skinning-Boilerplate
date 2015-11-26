::untested code
@echo off&setlocal
for %%i in ("%~dp0..") do set "folder=%%~fi"
echo %folder%
call npm install
