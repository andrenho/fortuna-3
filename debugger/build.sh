#!/bin/bash -e

if ! command -v emcc &> /dev/null; then
  echo "emcc is required"
  exit
fi

if ! command -v npm &> /dev/null; then
  echo "npm is required"
  exit
fi

if ! command -v tsc &> /dev/null; then
  echo "tsc is required"
  exit
fi

echo "Building WASM emulator..."
cd fortuna3-emu/src-wasm && make && cd ../..

echo "Building TS emulator..."
cd fortuna3-emu && npm install && npm run build && cd ..

echo "Building debugger..."
cd fortuna3-dbg && npm install && npm run build && cd ..

echo "Building backend..."
rm -rf fortuna3-backend/src/main/resources/static/*
mkdir -p fortuna3-backend/src/main/resources/static/
cp -r fortuna3-dbg/build/* fortuna3-backend/src/main/resources/static/
cd fortuna3-backend && mvn -DskipTests clean install && cd ..
cp fortuna3-backend/target/*.jar .

echo "All done. Run the debugger using 'java -DprojectPath='my_project.json' -jar ./fortuna-3-*.jar'"
