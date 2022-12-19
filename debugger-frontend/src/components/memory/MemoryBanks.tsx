import React from "react";
import {hex} from "util/hex";
import {range} from "util/array";
import css from "./MemoryBanks.module.scss";

type MemoryBankProps = {
    index: number,
    assigned: boolean,
}

const MemoryBank : React.FC<MemoryBankProps> = ({ index, assigned }) => {

    let internalClass = css.bankInternal + ' ';
    if (assigned)
        internalClass += css.bankActive;

    return <div className={css.bank}>
        <div className={internalClass}>
            {hex(index, 1)}
        </div>
    </div>;
}

type MemoryBanksProps = {
    ramBank: number,
    bankCount: number,
}

const MemoryBanks : React.FC<MemoryBanksProps> = ({ ramBank, bankCount }) => {

    return <div className={css.main}>
        { range(bankCount).map(v => <MemoryBank key={`memoryBank_${v}`} index={v} assigned={ramBank === v} />) }
    </div>;
}

export default MemoryBanks;