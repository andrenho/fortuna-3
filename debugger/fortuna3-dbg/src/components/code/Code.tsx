import {observer} from "mobx-react-lite";
import useStore from "hooks/useStore";
import {SourceLine} from "store/types/debuggingInfo";
import {hex} from "util/hex";
import css from "./Code.module.scss";

const sourceFileNotFound : SourceLine[] = [ { line: "Source file not found in debugging info." } ];
const projectNotSelected : SourceLine[] = [ { line: "No project is selected." } ];

type CodeProps = {
    selectedFile: string | undefined,
};

const Code: React.FC<CodeProps> = observer(({selectedFile}) => {

    const replaceChars = (text: string | undefined) : string => {
        if (text === undefined)
            return "";
        return text
            .replaceAll(" ", "\u00A0")
            .replaceAll("\t", "\u00A0".repeat(8));
    };

    const parseCode = (line: string) : JSX.Element => {
        let [code, comment] = line.split(";");
        code = replaceChars(code);
        comment = replaceChars(comment);
        if (comment)
            comment = `;${comment}`;
        return <><span>{ code }</span><span style={{color:"forestgreen"}}>{ comment }</span></>;
    };

    const store = useStore();
    const { state, currentProject } = store;

    let currentSource : SourceLine[];
    if (currentProject === undefined)
        currentSource = projectNotSelected;
    else if (selectedFile && selectedFile in currentProject.source)
        currentSource = currentProject.source[selectedFile];
    else
        currentSource = sourceFileNotFound;

    const swapBreakpoint = (address: number | undefined) => {
        console.log(address);
        if (address)
            store.swapBreakpoint(address);
    }

    return <table className={css.code}>
        <tbody>
            { currentSource.map((line, i) => (
                <tr key={`sl_${i}`} style={{ backgroundColor: (state.cpu.pc === line.address) ? "yellow" : "white" }}>
                    <td className={css.breakpoint} style={{background: (state.breakpoints.includes(line.address!)) ? "red" : undefined}} onClick={() => swapBreakpoint(line.address)}></td>
                    <td className={css.address}>{ line.address != null ? hex(line.address, 4) : undefined }</td>
                    <td className={css.line}>{ parseCode(line.line) }</td>
                    <td className={css.bytes}>{ line.bytes != null ? line.bytes.map(v => hex(v, 2)).join(" ") : undefined }</td>
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