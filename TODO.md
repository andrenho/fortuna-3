## Frontend
- Organize frontend layout
- Add SDCard / file manager
- Create emulator + canvas
- Connect debugger to emulator

## Backend
- Reorganize backend
  - Define command switches
- Serve static website (?)
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