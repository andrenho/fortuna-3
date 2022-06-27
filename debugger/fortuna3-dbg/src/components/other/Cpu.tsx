import {observer} from "mobx-react-lite";
import Box from "../common/Box";
import {StyleSet} from "../../util/types";
import {hex} from "../../util/hex";
import useStore from "../../hooks/useStore";

type RegisterProps = {
    name: string,
    value: number,
    size: number,
}

const Register = (props: RegisterProps) : JSX.Element => {
    return (<div>
        <div style={{fontWeight: "bold", fontSize: "11px"}}>{ props.name }</div>
        <div style={{border: "1px black solid", padding: "2px"}}>{ hex(props.value, props.size) }</div>
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

const columns = 7;
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
            <Register name="AF" value={cpu.af} size={4} />
            <Register name="BC" value={cpu.bc} size={4} />
            <Register name="DE" value={cpu.de} size={4} />
            <Register name="HL" value={cpu.hl} size={4} />
            <Register name="SP" value={cpu.sp} size={4} />
            <Register name="PC" value={cpu.pc} size={4} />
            <Register name="I" value={cpu.i} size={2} />
            <Register name="AF'" value={cpu.afx} size={4} />
            <Register name="BC'" value={cpu.bcx} size={4} />
            <Register name="DE'" value={cpu.dex} size={4} />
            <Register name="HL'" value={cpu.hlx} size={4} />
            <Register name="IX" value={cpu.ix} size={4} />
            <Register name="IY" value={cpu.iy} size={4} />
        </div>
        <div style={style.flags}>
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