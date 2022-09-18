import React from "react";
import useStore from "hooks/useStore";
import {hex} from "util/hex";
import css from "css/memory/Stack.module.scss";

const Stack : React.FC = () => {

    const { state } = useStore();

    const values : string[] = [];
    for (let i = 0; i < state.stack.length; i += 2)
        values.push(hex(state.stack[i] | (state.stack[i + 1] << 8), 4));

    return <div className={css.main}>
        <div className={css.title}>Stack:</div>
        <div>{ values.join(" ") }</div>
        <div className={css.arrow}>PUSH <span style={{letterSpacing: "-2px"}}>--&gt;</span></div>
    </div>;
}

export default Stack;