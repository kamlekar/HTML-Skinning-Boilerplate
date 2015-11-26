::untested code
@echo off&setlocal
for %%i in ("%~dp0..") do set "folder=%%~fi"
echo %folder%
start sass --watch sass:"site/assets/css" --style expanded
start gulp watch