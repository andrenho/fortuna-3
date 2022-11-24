rem @echo off

WHERE emcc
IF %ERRORLEVEL% NEQ 0 ECHO emcc is required

WHERE npm
IF %ERRORLEVEL% NEQ 0 ECHO npm is required

WHERE make
IF %ERRORLEVEL% NEQ 0 ECHO make is required

ECHO Building WASM emulator...
pushd fortuna3-emu\src-wasm
make
popd

ECHO Building TS emulator...
pushd fortuna3-emu
start /w npm install ^&^& exit
start /w npm run build ^&^& exit
popd

ECHO Building debugger...
pushd fortuna3-dbg
start /w npm install ^&^& exit
start /w npm run build ^&^& exit
cd ..

ECHO Building backend...
rd /S /Q fortuna3-backend\src\main\resources\static
mkdir fortuna3-backend\src\main\resources\static
robocopy fortuna3-dbg\build /s /e
cd fortuna3-backend
start /w mvn -DskipTests clean install ^&^& exit
cd ..
copy fortuna3-backend\target\*.jar .
