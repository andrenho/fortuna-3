import {observer} from "mobx-react-lite";
import Box from "components/common/box/Box";
import Register from "components/common/register/Register";
import Flag from "components/common/flag/Flag";
import CSS from "csstype";
import css from "./Cpu.module.scss";
import {Z80State} from "api/fortuna3-emulator";

type CpuProps = {
    cpu: Z80State,
}

const columns = 7;
const rows = 2;

const gridStyle : CSS.Properties = {
    gridTemplateColumns: "auto ".repeat(columns),
    gridTemplateRows: "auto ".repeat(rows),
    gridTemplateAreas: (`"${". ".repeat(columns)}" `).repeat(rows) + `"${"flags ".repeat(columns)}"`,
}

const CPU : React.FC<CpuProps> = observer(({ cpu }) => {

    return <Box title="Z80">
        <div style={gridStyle} className={css.registers}>
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
        <div className={css.flags}>
            <Flag name="C" value={cpu.c} />
            <Flag name="N" value={cpu.n} />
            <Flag name="P/V" value={cpu.pv} />
            <Flag name="H" value={cpu.h} />
            <Flag name="Z" value={cpu.z} />
            <Flag name="S" value={cpu.s} />
        </div>
    </Box>;
});

export default CPU;