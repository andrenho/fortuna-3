## By functionality

- [ ] Organize frontend layout
- [ ] Create options
  - [ ] Create options on frontend (browse project name, SDCard path / size)
  - [ ] GET, POST /api/config on backend
  - [ ] Save config on disk, read from disk on initialization
  - [ ] Reload config on frontend initialization
- [ ] SDCard access
  - [ ] Add SDCard on frontend
  - [ ] Backend raw access (read only?)
- [ ] Emulation
  - [ ] Create base C library, compile to WASM
    - [ ] Automate process using maven (?)
  - [ ] Create JS emulator base, connect to WASM modules
    - [ ] Add canvas component
  - [ ] Add Z80 emulation
  - [ ] UART emulation
  - [ ] SDCard with FAT32
- [ ] SDCard filemanager
  - [ ] Create frontend component
  - [ ] Use emulator FAT32 implementation to read files
- [ ] Compilation
  - [ ] Read config file, find all related files
  - [ ] Create thread that monitors changed files and reruns compiler
  - [ ] Run compiler
  - [ ] Read and interpret listing file
  - [ ] GET /api/debugInfo
  - [ ] GET /api/debugInfoCRC (or compilation count or UUID or something)
- [ ] Debugging
  - [ ] Connect to emulator
  - [ ] Step
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

---

## By module

### Frontend
- Organize frontend layout
- Create options
- Add SDCard / file manager
- Create emulator + canvas
- Connect debugger to emulator

### Backend
- Reorganize backend (ok)
- Serve static website (ok)
- Debugger options
  - Project file path
    - GET /api/config
    - POST /api/config
- Assembly compilation
  - Define project JSON
  - Compilation thread
    - Compile code
    - Interpret debugger result
  - Implement API calls
     - GET /api/debugInfo
     - GET /api/debugInfoCRC
- SDCard
  - Raw access
    - Implementation
    - API
  - FAT32 access
    - Implementation
    - API

## Hardware
- Design motherboard 
  - Clock logic
  - With Z80, RAM, uC, wall clock
    - Glue logic to WAIT
  - I/O: UART, SDCard
  - 3 sockets (with power, parallel data, selector line, SPI)
  - Additional 2-row display (? - or from board?)
- uC code
  - Z80 management
  - Load boot code into memory
  - Z80 I/O
    - UART
    - Memory management
    - SDCard + FAT32
    - Timers
    - Wall clock
    - Peripheral management
      - Parallel communication
      - SPI
- Additional boards
  - Video (TMS9918?)

## Software
- Operating system
  - command
  - fortunalib
- Tetris (?)