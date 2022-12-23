import React from 'react';
import css from "pages/DocumentationPage.module.scss";

const TD : React.FC<React.PropsWithChildren> = ({ children }) => (
    <td style={{ paddingRight: "16px" }}>{ children }</td>
);

const DocumentationPage : React.FC = () => {
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
            <thead>
                <tr>
                    <th className={css.th}>Hex</th>
                    <th className={css.th}>Bin</th>
                    <th className={css.th}>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <TD>00</TD>
                    <TD>00000000</TD>
                    <TD>UART serial output (print char)</TD>
                </tr>
            </tbody>
        </table>

        <h2>Z80 Input</h2>
        <table>
            <thead>
                <tr>
                    <th className={css.th}>Hex</th>
                    <th className={css.th}>Bin</th>
                    <th className={css.th}>Description</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <TD>00</TD>
                    <TD>00000000</TD>
                    <TD>UART serial input (get input from keyboard)</TD>
                </tr>
            </tbody>
        </table>

    </>);
};

export default DocumentationPage;