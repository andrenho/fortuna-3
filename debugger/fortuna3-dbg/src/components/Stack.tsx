import useStore from "../hooks/useStore";
import {StyleSet} from "../util/types";
import {hex} from "../util/hex";

const style : StyleSet = {
    main : {
        paddingTop: "12px",
        display: "grid",
        gridTemplateColumns: "auto auto",
        gridTemplateRows: "auto auto",
        justifyContent: "start",
        flexDirection: "column",
    },
    title : {
        fontWeight: "bold",
        paddingRight: "12px",
    },
    arrow : {
        gridColumn: "2",
        fontWeight: "bold",
        fontSize: "10px",
    },
}

export default function Stack() : JSX.Element {

    const { state } = useStore();

    const values : string[] = [];
    for (let i = 0; i < state.stack.length; i += 2)
        values.push(hex(state.stack[i] | (state.stack[i + 1] << 8), 4));

    return (<div style={style.main}>
        <div style={style.title}>Stack:</div>
        <div>{ values.join(" ") }</div>
        <div style={style.arrow}>PUSH <span style={{letterSpacing: "-2px"}}>--&gt;</span></div>
    </div>);
}