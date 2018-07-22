@echo off
cd src
cd components
node generator.js
cd ..
cd views
node generator.js
pause