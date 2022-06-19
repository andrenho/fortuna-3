import Box from "./Box";
import CSS from "csstype";
import {PropsWithChildren} from "react";
import {hex} from "../util/hex";

const style : {[key: string] : CSS.Properties} = {
    spaceAfter: {
        width: "22px",
        paddingRight: "12px",
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
    }
}

interface FlatDataProps {
    title: string;
    currentPage: number;
    totalPages: number;
    rows: number;
    highlightAddress?: number;
    data: Uint8Array;
    onPageChange: (page: number) => void;
}

export default function FlatData(props: PropsWithChildren<FlatDataProps>) : JSX.Element {
    return (<Box title={props.title}>
        <div style={style.titleRow}>
            <label htmlFor="page">Page:</label>
            <button title="Previous page" style={style.input}>&lt;&lt;</button>
            <input id="page" type="text" size={8} value={hex(props.currentPage, 0, true)} style={{ textAlign: "right", ...style.input }} />
            <button title="Next page" style={style.input}>&gt;&gt;</button>
        </div>

        <table style={{tableLayout: "fixed", borderCollapse: "collapse"}}>
            <thead>
                <th style={{...style.th, width: "54px", minWidth: "54px", height: "28px"}}></th>
                {Array.from(Array(16).keys()).map(i => <th style={style.th}>_{ hex(i, 1) }</th>)}
                <th style={{...style.th, width: "150px", textAlign: "left"}}>ASCII</th>
            </thead>
            <tbody>

            </tbody>
        </table>
    </Box>);
}