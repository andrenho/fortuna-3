import Box from "components/common/box/Box";
import React, { useState } from "react";
import {observer} from "mobx-react-lite";
import {range} from "util/array";
import css from "./UART.module.scss";

type CharacterProps = {
    char: string,
    cursor: boolean,
}

const Character : React.FC<CharacterProps> = observer(({ char, cursor }) => {
    return <span className={css.characterStyle} style={{backgroundColor: cursor ? "lime" : "initial"}}>{ char }</span>
});

type UARTProps = {
    columns: number,
    rows: number,
    lines: string[][],
    cursorX: number,
    cursorY: number,
    onKeyPress?: (key: number) => void,
}

const UART : React.FC<UARTProps> = observer(({ columns, rows, lines, cursorX, cursorY, onKeyPress }) => {

    const [waitingForKeypress, setWaitingForKeypress] = useState(false);
    const [lastKeyPressed, setLastKeyPressed] = useState<string | undefined>(undefined);

    const onKeydownEvent = (key: KeyboardEvent) : void => {
        onKeyPress && onKeyPress(key.keyCode);
        setLastKeyPressed(key.key);
        key.preventDefault();
        cancelWaitForKeypress();
    };

    const waitForKeypress = () => {
        setWaitingForKeypress(true);
        window.addEventListener("keydown", onKeydownEvent);
    };

    const cancelWaitForKeypress = () => {
        setWaitingForKeypress(false);
        window.removeEventListener("keydown", onKeydownEvent);
    };

    const character = (row: number, column: number) : JSX.Element => {
        let c;
        try {
            c = lines[row][column];
        } catch {
            c = ' ';
        }

        return <Character char={c} cursor={cursorX === column && cursorY === row} />;
    }

    return (
        <Box title="UART Terminal">
            <table style={{ borderCollapse: "collapse" }}>
                <tbody>
                { range(rows).map(line => <tr key={`uart_${line}`}>{ range(columns).map(column => (
                    <td style={{padding: 0}} key={`uart_${line}_${column}`}>{ character(line, column) }</td>
                )) }</tr>) }
                </tbody>
            </table>
            <div className={css.inputButton}>
                { !waitingForKeypress && <>
                    { lastKeyPressed && <span>(last: { lastKeyPressed })</span> }
                    <button onClick={waitForKeypress}>Keyboard input</button>
                </>}
                { waitingForKeypress && <>
                    <span className={css.waiting}>Waiting for keypress...</span>
                    <button onClick={cancelWaitForKeypress}>Cancel</button>
                </>}
            </div>
        </Box>
    );
});

export default UART;