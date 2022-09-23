import React from "react";
import {hex} from "util/hex";
import {range} from "util/array";
import useStore from "hooks/useStore";
import css from "./MemoryBanks.module.scss";

interface MemoryBankProps {
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

const MemoryBanks : React.FC = () => {

    const { state } = useStore();

    return <div className={css.main}>
        { range(16).map(v => <MemoryBank key={`memoryBank_${v}`} index={v} assignedTo={state.ramBanks.find((w : number) => w === v)} />) }
    </div>;
}

export default MemoryBanks;