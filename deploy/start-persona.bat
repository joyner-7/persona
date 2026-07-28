@echo off
cd /d C:\persona
"C:\nvm4w\nodejs\node.exe" "C:\nvm4w\nodejs\node_modules\serve\build\main.js" -l tcp://0.0.0.0:80 .
