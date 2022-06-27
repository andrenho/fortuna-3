#!/bin/bash -e

if ! command -v emcc &> /dev/null; then
  echo "emcc is required"
  exit
fi

if ! command -v npm &> /dev/null; then
  echo "npm is required"
  exit
fi

echo "Building WASM emulator..."
cd emulator-wasm && make && cd ..

echo "Building TS emulator..."
cd fortuna3-emu && npm install && npm run build && cd ..

echo "Building debugger..."
cd fortuna3-dbg && npm install && cd ..

echo "All done. Cd into fotuna3-dbg and run 'npm start' to run the debugger."
