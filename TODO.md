- [x] Initial setup
  - [x] Create typescript library for emulator + WASM
  - [x] Create React project that connects to library
  - [x] Create store
- [x] Tabs component (General + SDCard + Documentation), general layout
- [x] Component for computer module (closeable)

- [x] RAM
  - [x] On emulator (WASM) + banks
    - [x] Either zero or random on initialization
  - [x] On emulator (TS)
  - [x] Component
    - [x] Banks on debugger
    - [x] Stack on debugger
    - [x] PC

- [x] SDCard
  - [x] On emulator (WASM)
    - [x] Empty SDCard
    - [x] Empty FAT on initialization (pass size + type from debugger)
    - [x] Treat errors
  - [x] On emulator (TS)
  - [x] Component
  - [ ] Show files (?)
  - [x] Download image

- [x] Redo loading module
- [x] Build script

- [x] CPU
  - [x] On emulator (WASM)
  - [x] On emulator (TS)
  - [x] On debugger
    - [x] CPU component
    - [x] Buttons component
      - [x] Reset
      - [x] Step

- [x] Code debugger
  - [x] Create debugger in main component
    - [x] Source code formatting
    - [x] Detect changes in source file
  - [x] Add breakpoints (WASM)
  - [x] Add breakpoints (TS)
  - [x] Add breakpoints on main component

- [x] Move WASM project to main directory

- [ ] Spring application
  - [ ] Project file format
  - [ ] Watch for changes
  - [ ] Auto-compile
  - [ ] Debugger: watch for changes, receive file

- [ ] Manage code
  - [ ] Add/remove breakpoints

- [ ] Video
  - [ ] On emulator (WASM)
  - [ ] Provide component

- [ ] Running
  - [ ] Run
  - [ ] Run with breakpoints
  - [ ] Next

- [ ] Fortuna-3 specific stuff
  - [ ] Memory management
  - [ ] SDCard + FAT32
  - [ ] Timers
  - [ ] Wall clock
  - [ ] Peripheral management
  - [ ] Parallel communication
  - [ ] SPI
