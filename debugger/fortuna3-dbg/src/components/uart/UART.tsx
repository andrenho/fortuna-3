import Box from "components/common/box/Box";
import React from "react";
import {observer} from "mobx-react-lite";
import {range} from "util/array";
import useStore from "hooks/useStore";
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
}

const UART : React.FC<UARTProps> = observer(({ columns, rows }) => {

    const { uartTerminal } = useStore();

    const character = (row: number, column: number) : JSX.Element => {
        return <Character char={uartTerminal.lines[row][column]} cursor={uartTerminal.cursorX === column && uartTerminal.cursorY === row} />;
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
        </Box>
    );
});

export default UART;