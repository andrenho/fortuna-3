import Box from "./Box";
import CSS from "csstype";
import {PropsWithChildren} from "react";
import {hex} from "../util/hex";
import {range} from "../util/array";
import Color from "color";

const style : {[key: string] : CSS.Properties} = {
    spaceAfter: {
        paddingRight: "12px",
        paddingLeft: "4px"
    },
    titleRow: {
        display: "flex",
        gap: "4px",
        alignItems: "baseline",
        marginBottom: "24px",
    },
    address: {
        fontWeight: "bold",
    },
    data: {
        textAlign: "center",
    },
    zero: {
        color: "lightgray",
    },
    error: {
        backgroundColor: "lightcoral",
    },
    highlighted: {
        backgroundColor: "mediumspringgreen",
    },
    input: {
        fontSize: "medium"
    },
    th: {
        width: "21px",
        minWidth: "21px",
        verticalAlign: "top",
        textAlign: "left",
    }
}

interface FlatDataProps {
    title: string;
    currentPage: number;
    totalPages: number;
    rows: number;
    data: Uint8Array;
    onPageChange: (page: number) => void;
    highlightOffset?: {[key: number]: Color}
}

export default function FlatData(props: PropsWithChildren<FlatDataProps>) : JSX.Element {

    const asciiChar = (datum: number) : string => (datum < 32 || datum >= 127) ? "." : String.fromCharCode(datum);
    const data = (row: number, col: number) : number => props.data[row * 16 + col];

    const stepPage = (diff: -1 | 1) => {
        let newPage = props.currentPage + diff;
        if (newPage <= -1)
            newPage = props.totalPages - 1;
        else if (newPage >= props.totalPages)
            newPage = 0;
        props.onPageChange(newPage);
    };

    const dataStyle = (row: number, col: number) : CSS.Properties => {
        let myStyle = {...style.data};
        if (data(row, col) === 0)
            myStyle.color = "#b0b0b0";
        if (col === 7 || col === 15)
            myStyle = {...myStyle, ...style.spaceAfter};
        return myStyle;
    };

    return (<Box title={props.title}>
        <div style={style.titleRow}>
            <label htmlFor="page">Page:</label>
            <button title="Previous page" style={style.input} onClick={() => stepPage(-1)}>&lt;&lt;</button>
            <input id="page" type="text" size={8} value={hex(props.currentPage, 0, true)} style={{ textAlign: "right", ...style.input }} />
            <button title="Next page" style={style.input} onClick={() => stepPage(1)}>&gt;&gt;</button>
        </div>

        <table style={{tableLayout: "fixed", borderCollapse: "collapse"}}>
            <thead>
                <tr>
                    <th key="empty" style={{...style.th, width: "54px", minWidth: "54px", height: "28px"}}></th>
                    {range(16).map(i => <th key={`col_${i}`} style={style.th}>_{ hex(i, 1) }</th>)}
                    <th key="ascii" style={{...style.th, width: "150px", textAlign: "left"}}>ASCII</th>
                </tr>
            </thead>

            <tbody>
            {
                range(props.rows).map(row => (
                    <tr key={`row_${row}`}>
                        <td key={`addr_${row}`} style={style.address}>{ hex((props.currentPage * props.rows / 0x10) + row, 3) }_</td>
                        {range(16).map(col => (
                            <td key={`${row}_${col}`} style={dataStyle(row, col)}>
                                { hex(data(row, col)) }
                            </td>
                        ))}
                        <td key={`ascii_${row}`} style={style.data}>
                            { range(16).map(col => asciiChar(data(row, col))) }
                        </td>
                    </tr>
                ))
            }
            </tbody>
        </table>
        {props.children}
    </Box>);
}