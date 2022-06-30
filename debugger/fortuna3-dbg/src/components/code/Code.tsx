import {observer} from "mobx-react-lite";
import useStore from "../../hooks/useStore";
import {StyleSet} from "../../util/types";
import {SourceLine} from "../../store/types/debuggingInfo";
import {hex} from "../../util/hex";
import CSS from "csstype";

const td : CSS.Properties = {
    border: 0,
    paddingRight: "8px",
    paddingLeft: "8px",
};

const style : StyleSet = {
    code: {
        border: "1px black solid",
        borderCollapse: "collapse",
        tableLayout: "fixed",
        minHeight: "600px",
        height: "100%",
        boxShadow: "6px 6px 6px lightgray",
    },
    breakpoint: {
        ...td,
        width: "21px",
        padding: 0,
        borderRight: "1px black solid",
        cursor: "pointer",
    },
    line: {
        ...td,
        width: "400px",
        overflowX: "hidden",
        whiteSpace: "nowrap",
    },
    address: {
        ...td,
        width: "35px",
        borderRight: "1px black solid",
        fontWeight: "bold",
    },
    bytes: {
        ...td,
        borderLeft: "1px black solid",
        width: "120px",
    },
    lastLine: {
        height: "100%",
    },
};

type CodeProps = {
    selectedFile: string | undefined,
};

const sourceFileNotFound : SourceLine[] = [ { line: "Source file not found in debugging info." } ];
const projectNotSelected : SourceLine[] = [ { line: "No project is selected." } ];

const Code = observer((props: CodeProps) : JSX.Element => {

    const parseCode = (line: string) : JSX.Element => {
        let [code, comment] = line.split(";");
        code = code?.replaceAll(" ", "\u00A0");
        comment = comment?.replaceAll(" ", "\u00A0");
        if (comment)
            comment = `;${comment}`;
        return <><span>{ code }</span><span style={{color:"forestgreen"}}>{ comment }</span></>;
    };

    const store = useStore();
    const { state, currentProject } = store;

    let currentSource : SourceLine[];
    if (currentProject === undefined)
        currentSource = projectNotSelected;
    else if (props.selectedFile && props.selectedFile in currentProject.source)
        currentSource = currentProject.source[props.selectedFile];
    else
        currentSource = sourceFileNotFound;

    const swapBreakpoint = (address: number | undefined) => {
        console.log(address);
        if (address)
            store.swapBreakpoint(address);
    }

    return (<table style={style.code}>
        <tbody>
            { currentSource.map((line, i) => (
                <tr key={`sl_${i}`} style={{ backgroundColor: (state.cpu.pc === line.address) ? "yellow" : "white" }}>
                    <td style={{...style.breakpoint, background: (state.breakpoints.includes(line.address!)) ? "red" : undefined}} onClick={() => swapBreakpoint(line.address)}></td>
                    <td style={style.address}>{ line.address !== undefined ? hex(line.address, 4) : undefined }</td>
                    <td style={style.line}>{ parseCode(line.line) }</td>
                    <td style={style.bytes}>{ line.bytes !== undefined ? line.bytes.map(v => hex(v, 2)).join(" ") : undefined }</td>
                </tr>
            ))}
            <tr style={{backgroundColor: "white"}}>
                <td style={{...style.breakpoint, ...style.lastLine}}></td>
                <td style={{...style.address, ...style.lastLine}}></td>
                <td style={{...style.line, ...style.lastLine}}></td>
                <td style={{...style.bytes, ...style.lastLine}}></td>
            </tr>
        </tbody>
    </table>);
});

export default Code;