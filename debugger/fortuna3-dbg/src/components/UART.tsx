import Box from "./common/Box";
import {range} from "../util/array";

type UARTProps = {
    columns: number,
    rows: number,
}

const UART = (props: UARTProps) : JSX.Element => {

    const character = (line: number, character: number) : JSX.Element => {
        return <></>;
    }

    return (
        <Box title="UART Terminal">
            <table>
                { range(props.rows).map(line => <tr>{ range(props.columns).map(column => <td>{ character(line, column) }</td>) }</tr>) }
            </table>
        </Box>
    );
};

export default UART;