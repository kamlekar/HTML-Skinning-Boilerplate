@echo off&setlocal
for %%i in ("%~dp0..") do set "folder=%%~fi"
echo %folder%
call npm install -g gulp
call npm install --save-dev gulp
call npm install --save-dev gulp-nunjucks-render
