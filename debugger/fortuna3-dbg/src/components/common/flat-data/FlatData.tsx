import React, {PropsWithChildren, useEffect, useState} from "react";
import {hex} from "util/hex";
import {range} from "util/array";
import CSS from "csstype";
import css from "./FlatData.module.scss"
import Hex from "../hex/Hex";

export type Highlights = {[key: number]: string};

type FlatDataProps = {
    currentPage: number;
    totalPages: number;
    rows: number;
    bytes: Uint8Array;
    onPageChange: (page: number) => void;
    highlightOffset?: Highlights;
    topRightElement?: React.ReactNode;
}

const FlatData : React.FC<PropsWithChildren<FlatDataProps>> = ({ currentPage, totalPages, rows, bytes, onPageChange, highlightOffset, topRightElement, children }) => {

    const [pageText, setPageText] = useState("");
    useEffect(() => setPageText(hex(currentPage, 0, true)), [currentPage]);

    const asciiChar = (datum: number) : string => ((datum < 32 || datum >= 127) ? "." : String.fromCharCode(datum));
    const data = (row: number, col: number) : number => bytes[row * 16 + col];

    const updatePage = (newPage: number) => {
        if (newPage <= -1)
            newPage = totalPages - 1;
        else if (newPage >= totalPages)
            newPage = 0;
        onPageChange(newPage);
    };

    const dataStyle = (row: number, col: number) : string => {
        let myClass = css.data + ' ';
        if (data(row, col) === 0)
            myClass += css.zero + ' ';
        if (col === 7 || col === 15)
            myClass += css.spaceAfter + ' ';
        return myClass;
    };

    const highlight = (row: number, col: number) : CSS.Properties => {
        const addr = row * 16 + col;
        if (highlightOffset && highlightOffset[addr])
            return { "backgroundColor": highlightOffset[addr] };
        return {};
    };

    const onTypePage = () => {
        const newPage = parseInt(pageText, 16);
        if (isNaN(newPage))
            setPageText(hex(currentPage, 0, true));
        else
            updatePage(newPage);
    };

    return <div>
        <div className={css.titleRow}>
            <label htmlFor="page">Page:</label>
            <button title="Previous page" className={css.input} onClick={() => updatePage(currentPage - 1)}>&lt;&lt;</button>
            <input type="text" size={8} value={pageText} onChange={e => setPageText(e.target.value)} onBlur={onTypePage} className={css.input} style={{ textAlign: "right" }} />
            <button title="Next page" className={css.input} onClick={() => updatePage(currentPage + 1)}>&gt;&gt;</button>
            {topRightElement}
        </div>

        <table style={{tableLayout: "fixed", borderCollapse: "collapse"}}>
            <thead>
                <tr>
                    <th key="empty" className={`${css.th} ${css.firstColumn}`}></th>
                    {range(16).map(i => <th key={`col_${i}`} className={css.th}><Hex value={i} pad={1} prefix="_" withPrefix/></th>)}
                    <th key="ascii" className={`${css.th} ${css.asciiColumn}`}>ASCII</th>
                </tr>
            </thead>

            <tbody>
            {
                range(rows).map(row => (
                    <tr key={`row_${row}`}>
                        <td key={`addr_${row}`} className={css.address}>
                            <Hex value={(currentPage * rows) + row} pad={3} postfix="_" />
                        </td>
                        {range(16).map(col => (
                            <td key={`${row}_${col}`} className={dataStyle(row, col)} style={highlight(row, col)}>
                                <Hex value={data(row, col)} />
                            </td>
                        ))}
                        <td key={`ascii_${row}`} className={css.data}>
                            <pre className={css.predata}>{ range(16).map(col => asciiChar(data(row, col))) }</pre>
                        </td>
                    </tr>
                ))
            }
            </tbody>
        </table>
        {children}
    </div>;
};

export default FlatData;