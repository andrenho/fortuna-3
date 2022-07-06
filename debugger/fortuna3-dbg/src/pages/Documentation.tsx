import {StyleSet} from "../util/types";
import React from 'react';

const style : StyleSet = {
    th: {
        textAlign: "left",
    },
}

const TD = (props: React.PropsWithChildren) : JSX.Element => (
    <td style={{ paddingRight: "16px" }}>{ props.children }</td>
);

const Documentation = () : JSX.Element => {
    return (<>
        <h2>Fortuna-3</h2>
        <ul>
            <li>Z80 CPU running at 4 Mhz</li>
            <li>512 kB RAM (divided in 16 banks of 32 kB each)</li>
            <li>ATMEGA2560 - UART, MMU, SDcard + FAT32, timers, wall clock, SPI for external communication</li>
            <li>RPi W Zero - Video, Audio, Keyboard, Network + Wi-fi</li>
        </ul>

        <h2>Z80 Output</h2>
        <table>
            <tr>
                <th style={style.th}>Hex</th>
                <th style={style.th}>Bin</th>
                <th style={style.th}>Description</th>
            </tr>
            <tr>
                <TD>00</TD>
                <TD>00000000</TD>
                <TD>UART serial output (print char)</TD>
            </tr>
        </table>

        <h2>Z80 Input</h2>
        <table>
            <tr>
                <th style={style.th}>Hex</th>
                <th style={style.th}>Bin</th>
                <th style={style.th}>Description</th>
            </tr>
            <tr>
                <TD>00</TD>
                <TD>00000000</TD>
                <TD>UART serial input (get input from keyboard)</TD>
            </tr>
        </table>

    </>);
};

export default Documentation;