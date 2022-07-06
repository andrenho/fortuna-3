class UartTerminal {
    lines: string[][];
    cursorX = 0;
    cursorY = 0;

    constructor(readonly terminalRows: number, readonly terminalColumns: number) {
        this.lines = Array(terminalRows).fill(null).map(() => Array(terminalColumns).fill(' '));
    }

    addChars(printedChars: string[]) {
        for (const chr of printedChars) {
            this.lines[this.cursorY][this.cursorX] = chr;

            if (this.cursorX === this.terminalColumns) {
                this.cursorX = 0;
                ++this.cursorY;
            }
            // TODO - move screen forward
        }
        if (printedChars.length > 0)
            console.log(this.lines);
    }
}

export default UartTerminal;