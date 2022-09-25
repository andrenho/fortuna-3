import React from "react";
import {hex} from "util/hex";
import css from "./Stack.module.scss";

type StackProps = {
    stack: Uint8Array;
}

const Stack : React.FC<StackProps> = ({ stack }) => {

    const values : string[] = [];
    for (let i = 0; i < stack.length; i += 2)
        values.push(hex(stack[i] | (stack[i + 1] << 8), 4));

    return <div className={css.main}>
        <div className={css.title}>Stack:</div>
        <div>{ values.join(" ") }</div>
        <div className={css.arrow}>PUSH <span style={{letterSpacing: "-2px"}}>--&gt;</span></div>
    </div>;
}

export default Stack;