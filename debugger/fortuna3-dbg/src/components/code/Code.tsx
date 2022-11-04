import Hex from "components/common/hex/Hex";
import {observer} from "mobx-react-lite";
import {SourceLine} from "store/types/debuggingInfo";
import css from "./Code.module.scss";

const sourceFileNotFound : SourceLine[] = [ { line: "Source file not found in debugging info." } ];

type CodeProps = {
    pc: number,
    breakpoints: number[],
    sourceLines: SourceLine[] | undefined,
    swapBreakpoint: (n: number) => void,
};

const Code: React.FC<CodeProps> = observer(({pc, breakpoints, sourceLines: source, swapBreakpoint}) => {

    const replaceTabs = (text: string) : string => {
        let newText = "";
        let i = 0;
        for (let c of text) {
            if (c === " ") {
                c = "\u00A0";
            } else if (c === "\t") {
                const spacesToNextTab = 8 - (i % 8);
                c = "\u00A0".repeat(spacesToNextTab);
            }
            newText += c;
            i += c.length;
        }
        return newText;
    };

    const parseCode = (line: string) : JSX.Element => {
        line = replaceTabs(line);
        let [code, comment] = line.split(";");
        if (comment)
            comment = `;${comment}`;
        return <><span>{ code }</span><span style={{color:"forestgreen"}}>{ comment }</span></>;
    };

    return <table className={css.code}>
        <tbody>
            { (source || sourceFileNotFound).map((line, i) => (
                <tr key={`sl_${i}`} style={{ backgroundColor: (pc === line.address) ? "yellow" : "white" }}>
                    <td className={css.breakpoint} 
                        style={{background: (breakpoints.includes(line.address!)) ? "red" : undefined}}
                        onClick={() => line.address !== undefined && swapBreakpoint(line.address)}>
                    </td>
                    <td className={css.address}>
                        { line.address != null ? <Hex key={`addr_${line.address}`} value={line.address} pad={4} /> : undefined }
                    </td>
                    <td className={css.line}>
                        { parseCode(line.line) }
                    </td>
                    <td className={css.bytes}>
                        { line.bytes != null ? line.bytes.map((v, j) => <Hex key={`b_${i}_${j}`} value={v} spaceAfter />) : undefined }
                    </td>
                </tr>
            ))}
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