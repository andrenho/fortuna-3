import {makeAutoObservable} from "mobx";

class UartTerminal {
    lines: string[][] = [];
    cursorX = 0;
    cursorY = 0;

    constructor(readonly terminalRows: number, readonly terminalColumns: number) {
        makeAutoObservable(this);
        this.reset();
    }

    addChars(printedChars: string[]) {
        for (const chr of printedChars) {
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
    }

    reset() {
        this.cursorX = 0;
        this.cursorY = 0;
        this.lines = Array(this.terminalRows).fill(null).map(() => Array(this.terminalColumns).fill(' '));
    }
}

export default UartTerminal;