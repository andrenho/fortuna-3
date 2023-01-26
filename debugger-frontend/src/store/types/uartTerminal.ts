import {makeAutoObservable} from "mobx";

class UartTerminal {
    lines: string[][] = [];
    cursorX = 0;
    cursorY = 0;

    constructor(readonly terminalRows: number, readonly terminalColumns: number) {
        makeAutoObservable(this);
        this.reset();
    }

    addRegularChar(chr: string) : void {
        this.lines[this.cursorY][this.cursorX] = chr;

        if (this.cursorX === this.terminalColumns - 1) {
            this.cursorX = 0;
            ++this.cursorY;
        } else {
            ++this.cursorX;
        }

        if (this.cursorY === this.terminalRows - 1) {
            this.lines.splice(0, 1);
            this.lines.push(Array(this.terminalColumns).fill(' '));
            --this.cursorY;
        }
    }

    backSpace() : void {
        if (this.cursorX > 0)
            --this.cursorX;
        this.lines[this.cursorY][this.cursorX] = ' ';
    }

    lineFeed() : void {
        this.cursorX = 0;
        ++this.cursorY;

        if (this.cursorY === this.terminalRows - 1) {
            this.lines.splice(0, 1);
            this.lines.push(Array(this.terminalColumns).fill(' '));
            --this.cursorY;
        }
    }

    addChars(printedChars: string[]) : void {
        // any changes here also need to be done on uart.c
        for (const chr of printedChars) {
            if (chr.codePointAt(0)! >= 32 && chr.codePointAt(0)! < 127) {
                this.addRegularChar(chr);
            } else if (chr === '\b') {
                this.backSpace();
            } else if (chr === '\r') {
                this.cursorX = 0;
            } else if (chr === '\n') {
                this.lineFeed();
            }
        }
    }

    reset() {
        this.cursorX = 0;
        this.cursorY = 0;
        this.lines = Array(this.terminalRows).fill(null).map(() => Array(this.terminalColumns).fill(' '));
    }
}

export default UartTerminal;