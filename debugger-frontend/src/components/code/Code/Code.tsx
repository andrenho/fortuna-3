import Hex from "components/common/Hex/Hex";
import {observer} from "mobx-react-lite";
import {SourceLine} from "store/types/debuggingInfo";
import css from "components/code/Code/Code.module.scss";
import React, {useEffect, useMemo} from "react";

const sourceFileNotFound : SourceLine[] = [ { line: "Source file not found in debugging info." } ];

type CodeProps = {
    pc: number,
    breakpoints: number[],
    sourceLines: SourceLine[] | undefined,
    swapBreakpoint: (n: number) => void,
};

const Code: React.FC<CodeProps> = observer(({pc, breakpoints, sourceLines: source, swapBreakpoint}) => {

    const lineRef = useMemo<{[key: number]: HTMLTableRowElement}>(() => ({}), []);

    const replaceTabs = (text: string) : string => {
        let newText = "";
        let i = 0;
        for (let c of text) {
            let chr = c;
            if (c === " ") {
                chr = "\u00A0";
            } else if (c === "\t") {
                const spacesToNextTab = 8 - (i % 8);
                chr = "\u00A0".repeat(spacesToNextTab);
            }
            newText += chr;
            i += chr.length;
        }
        return newText;
    };

    const parseCode = (line: string, macro: boolean) : JSX.Element => {
        line = replaceTabs(line);
        if (line === "")
            return <span>&nbsp;</span>;
        let [code, comment] = line.split(";");
        if (line.includes(";"))
            comment = `;${comment}`;
        return <>
            { !macro && <span>{ code }</span> }
            { macro && <span className={css.macro}>{ code }</span> }
            { comment && <span className={css.comment}>{ comment }</span> }
        </>;
    };

    useEffect(() => {
        const line = lineRef[pc];
        if (line) {
            if (line.getBoundingClientRect().bottom > window.innerHeight || line.getBoundingClientRect().top < 0) {
                line.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
            }
        }
    }, [pc, lineRef]);

    return <table className={css.code}>
        <tbody>
            { (source || sourceFileNotFound).map((line, i) => {
                const firstAddress = line.addresses ? line.addresses[0] : -1;
                return <tr
                    key={`sl_${i}`}
                    style={{ backgroundColor: (line.addresses?.includes(pc)) ? "yellow" : "white" }}
                    ref={node => node && (firstAddress !== -1) && (lineRef[firstAddress] = node)}
                >
                    <td className={css.breakpoint}
                        style={{background: (breakpoints.includes(firstAddress) ? "red" : undefined)}}
                        onClick={() => line.addresses !== undefined && swapBreakpoint(line.addresses[0])}>
                    </td>
                    <td className={css.address}>
                        { line.addresses != null ? <Hex key={`addr_${line.addresses}`} value={firstAddress} pad={4} /> : undefined }
                    </td>
                    <td className={css.line}>
                        { parseCode(line.line, line.isMacro || false) }
                    </td>
                    <td className={css.bytes}>
                        { line.bytes != null ? line.bytes.map((v, j) => <Hex key={`b_${i}_${j}`} value={v} spaceAfter />) : undefined }
                    </td>
                </tr>;
            }) }
            <tr style={{backgroundColor: "white"}}>
                <td className={`${css.breakpoint} ${css.lastLine}`}></td>
                <td className={`${css.address} ${css.lastLine}`}></td>
                <td className={`${css.line} ${css.lastLine}`}></td>
                <td className={`${css.bytes} ${css.lastLine}`}></td>
            </tr>
        </tbody>
    </table>;
});

export default Code;