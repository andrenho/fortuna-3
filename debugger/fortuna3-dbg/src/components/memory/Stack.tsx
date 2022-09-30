import Hex from "components/common/hex/Hex";
import React from "react";
import css from "./Stack.module.scss";

type StackProps = {
    stack: Uint8Array;
}

const Stack : React.FC<StackProps> = ({ stack }) => {

    const values : number[] = [];
    for (let i = 0; i < stack.length; i += 2)
        values.push(stack[i] | (stack[i + 1] << 8));

    return <div className={css.main}>
        <div className={css.title}>Stack:</div>
        <div>{ values.map(v => <Hex value={v} spaceAfter />) }</div>
        <div className={css.arrow}>PUSH <span style={{letterSpacing: "-2px"}}>--&gt;</span></div>
    </div>;
}

export default Stack;