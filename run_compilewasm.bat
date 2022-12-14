make -C debugger\fortuna3-emu\src-wasm

cd debugger\fortuna3-emu
start /w npm install ^&^& exit
start /w npm run build ^&^& exit

cd ..\fortuna3-dbg
start /w npm run install-emulator-js ^&^& exit
cd ..
