```
"cd " + path + " && " + compiler_full_path() + " -chklabels -L listing.txt -Llo -nosym -x -Fbin -o rom.bin " + filename + " 2>&1";
```

- A HTML emulator
  - Frontend contains emulator + debugger
    - Frontend emulator can run standalone
  - Backend manages compilation + SD card
- The computer
  - Motherboard
    - Z80 CPU
    - 512 kB RAM
    - ATMEGA1280 or ATMEGA2560
      - Boot from SDCard or internal ROM
      - Serial I/O
      - SDCard management + FAT32
      - Memory bank management
      - Timers
      - I/O active line management (?)
        - Allow SPI 
      - Wall clock
      - Additional 2-row display (? - or from board?)
    - Glue logic to WAIT CPU at I/O request
    - Clock (8 mhz?) + external clock socket
    - SDCard socket
    - Serial port
    - Generic I/O ports (6?)
    - 3.3V line
  - Initialization
    1. Load from "ROM" (up to 4k?) into RAM 0x0
  - Memory organization
    - 4 x 16kB pages
    - 3 pages interchangeable, last page is OS