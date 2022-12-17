import Box from "components/common/box/Box";
import Register from "components/common/register/Register";
import { observer } from "mobx-react-lite";
import { faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import css from "./ComputeUnit.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type ComputeUnitProps = {
    p: number,
    q: number,
    r: number,
}

const ComputeUnit : React.FC<ComputeUnitProps> = observer(({ p, q, r }) => {
    return <Box title="Compute Unit">
        <div className={css.container}>
            <div className={css.row}>
                <Register name="P" value={p} size={8} className={css.register} />
                <Register name="Q" value={q} size={8} className={css.register} />
                <Register name="R" value={r} size={8} className={css.register} />
            </div>
            <div className={css.row}>
                <Register name="Pa" value={p & 0xffff} size={4} className={css.register} />
                <Register name="Pb" value={(p >> 16) & 0xffff} size={4} className={css.register} />
                <Register name="Qa" value={q & 0xffff} size={4} className={css.register} />
                <Register name="Qb" value={(q >> 16) & 0xffff} size={4} className={css.register} />
                <Register name="Ra" value={r & 0xffff} size={4} className={css.register} />
                <Register name="Rb" value={(r >> 16) & 0xffff} size={4} className={css.register} />
            </div>
            <div className={css.row}>
                <Register name="Pa0" value={p & 0xff} size={2} />
                <Register name="Pa1" value={(p >> 8) & 0xff} size={2} />
                <Register name="Pb0" value={(p >> 16) & 0xff} size={2} />
                <Register name="Pb1" value={(p >> 24) & 0xff} size={2} />
                <Register name="Qa0" value={q & 0xff} size={2} />
                <Register name="Qa1" value={(q >> 8) & 0xff} size={2} />
                <Register name="Qb0" value={(q >> 16) & 0xff} size={2} />
                <Register name="Qb1" value={(q >> 24) & 0xff} size={2} />
                <Register name="Ra0" value={r & 0xff} size={2} />
                <Register name="Ra1" value={(r >> 8) & 0xff} size={2} />
                <Register name="Rb0" value={(r >> 16) & 0xff} size={2} />
                <Register name="Rb1" value={(r >> 24) & 0xff} size={2} />
            </div>
            <div className={css.row}>
                <a
                    href="https://docs.google.com/spreadsheets/d/1y4MHCu89Fbhpv18A4Xgcp7zTiwYp1vzCEpC4Fz_BkXo/edit?usp=sharing"
                    target="_blank"
                    className={css.link}
                    rel="noreferrer"
                >
                    <FontAwesomeIcon icon={faUpRightFromSquare} /> I/O Registers reference
                </a>
            </div>
        </div>
    </Box>;
});

export default ComputeUnit;