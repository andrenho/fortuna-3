#!/bin/sh

make -C debugger/fortuna3-emu/src-wasm
cd debugger/fortuna3-emu && npm install && npm run build && cd ../..
cd debugger/fortuna3-dbg && npm run install-emulator-js && cd ../..