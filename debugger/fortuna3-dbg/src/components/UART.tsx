import Box from "./common/Box";
import {range} from "../util/array";
import useStore from "../hooks/useStore";
import CSS from "csstype";
import {observer} from "mobx-react-lite";

type CharacterProps = {
    char: string,
    cursor: boolean,
}

const Character = observer((props: CharacterProps) : JSX.Element => {
    const characterStyle : CSS.Properties = {
        backgroundColor: props.cursor ? "lime" : "initial",
        fontSize: "18px",
        display: "inline-block",
        height: "19px",
        width: "10px",
    };
    return <span style={characterStyle}>{ props.char }</span>
});

type UARTProps = {
    columns: number,
    rows: number,
}

const UART = observer((props: UARTProps) : JSX.Element => {

    const { uartTerminal } = useStore();

    const character = (row: number, column: number) : JSX.Element => {
        return <Character char={uartTerminal.lines[row][column]} cursor={uartTerminal.cursorX === column && uartTerminal.cursorY === row} />;
    }

    return (
        <Box title="UART Terminal">
            <table style={{ borderCollapse: "collapse" }}>
                <tbody>
                { range(props.rows).map(line => <tr key={`uart_${line}`}>{ range(props.columns).map(column => (
                    <td style={{padding: 0}} key={`uart_${line}_${column}`}>{ character(line, column) }</td>
                )) }</tr>) }
                </tbody>
            </table>
        </Box>
    );
});

export default UART;