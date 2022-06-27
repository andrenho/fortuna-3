import {PropsWithChildren} from "react";
import {StyleSet} from "../../util/types";
import {hex} from "../../util/hex";
import {range} from "../../util/array";
import useStore from "../../hooks/useStore";

const style : StyleSet = {
    main: {
        display: "flex",
        alignItems: "center",
        paddingTop: "12px",
        gap: "3px",
    },
    bank: {
        border: "1px grey solid",
        height: "44px",
        width: "32px",
    },
    bankInternal: {
        padding: "4px",
        height: "36px",
        width: "24px",
        textAlign: "center",
    },
    bankActive: {
        padding: "0px",
        border: "4px solid paleturquoise",
    },
}

interface MemoryBankProps {
    index: number,
    assignedTo?: number | undefined,
}

function MemoryBank(props: MemoryBankProps) : JSX.Element {

    let internalStyle = {...style.bankInternal};
    if (props.assignedTo !== undefined)
        internalStyle = {...internalStyle, ...style.bankActive};

    return (<div style={style.bank}>
        <div style={internalStyle}>
            {hex(props.index, 1)}
            {props.assignedTo !== undefined && `\n[${hex(props.assignedTo, 1)}]`}
        </div>
    </div>);
}

export default function MemoryBanks(props: PropsWithChildren) : JSX.Element {

    const { state } = useStore();

    return (<div style={style.main}>
        { range(16).map(v => <MemoryBank key={`memoryBank_${v}`} index={v} assignedTo={state.ramBanks.find(w => w === v)} />) }
    </div>);
}