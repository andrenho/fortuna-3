import {observer} from "mobx-react-lite";
import Box from "./Box";
import {StyleSet} from "../util/types";
import {hex} from "../util/hex";
import useStore from "../hooks/useStore";

type RegisterProps = {
    name: string,
    value: number,
}

const Register = (props: RegisterProps) : JSX.Element => {
    return (<div>
        <div style={{fontWeight: "bold", fontSize: "11px"}}>{ props.name }</div>
        <div style={{border: "1px black solid", padding: "2px"}}>{ hex(props.value, 4) }</div>
    </div>);
};

//------------------

type FlagProps = {
    name: string,
    value: boolean,
};

const Flag = (props: FlagProps) : JSX.Element => {
    return (<label>
        <input type="checkbox" onChange={() => false} checked={props.value} />
        <span>{ props.name }</span>
    </label>);
};

//-----------------

const columns = 6;
const rows = 2;

const style : StyleSet = {
    registers: {
        display: "grid",
        gridTemplateColumns: "auto ".repeat(columns),
        gridTemplateRows: "auto ".repeat(rows),
        gridTemplateAreas: (`"${". ".repeat(columns)}" `).repeat(rows) + `"${"flags ".repeat(columns)}"`,
        justifyContent: "start",
        columnGap: "10px",
        rowGap: "14px",
    },
    flags: {
        display: "flex",
        gap: "12px",
    },
};

const CPU = observer(() : JSX.Element => {

    const { state } = useStore();
    const { cpu } = state;

    return (<Box title="Z80">
        <div style={style.registers}>
            <Register name="AF" value={cpu.af} />
            <Register name="BC" value={cpu.bc} />
            <Register name="DE" value={cpu.de} />
            <Register name="HL" value={cpu.hl} />
            <Register name="SP" value={cpu.sp} />
            <Register name="PC" value={cpu.pc} />
            <Register name="AF'" value={cpu.afx} />
            <Register name="BC'" value={cpu.bcx} />
            <Register name="DE'" value={cpu.dex} />
            <Register name="HL'" value={cpu.hlx} />
            <Register name="IX" value={cpu.ix} />
            <Register name="IY" value={cpu.iy} />
        </div>
        <div style={style.flags}>
            <Flag name="I" value={cpu.i} />
            <Flag name="C" value={cpu.c} />
            <Flag name="N" value={cpu.n} />
            <Flag name="P/V" value={cpu.pv} />
            <Flag name="H" value={cpu.h} />
            <Flag name="Z" value={cpu.z} />
            <Flag name="S" value={cpu.s} />
        </div>
    </Box>);
});

export default CPU;