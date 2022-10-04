import React from "react";
import {hex} from "util/hex";
import {range} from "util/array";
import css from "./MemoryBanks.module.scss";

type MemoryBankProps = {
    index: number,
    assignedTo?: number | undefined,
}

const MemoryBank : React.FC<MemoryBankProps> = ({ index, assignedTo }) => {

    let internalClass = css.bankInternal + ' ';
    if (assignedTo !== undefined)
        internalClass += css.bankActive;

    return <div className={css.bank}>
        <div className={internalClass}>
            {hex(index, 1)}
            {assignedTo !== undefined && `\n[${hex(assignedTo, 1)}]`}
        </div>
    </div>;
}

type MemoryBanksProps = {
    ramBanks: number[],
    bankCount: number,
}

const MemoryBanks : React.FC<MemoryBanksProps> = ({ ramBanks, bankCount }) => {

    return <div className={css.main}>
        { range(bankCount).map(v => <MemoryBank key={`memoryBank_${v}`} index={v} assignedTo={ramBanks.find((w : number) => w === v)} />) }
    </div>;
}

export default MemoryBanks;