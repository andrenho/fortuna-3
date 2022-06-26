import {StyleSet} from "../../util/types";
import useStore from "../../hooks/useStore";

const style : StyleSet = {
    buttons: {
        position: "fixed",
        top: 0,
        right: 0,
        borderLeft: "2px solid black",
        borderBottom: "2px solid black",
        padding: "12px",
        background: "white",
        zIndex: 100,
        boxShadow: "6px 6px 6px lightgray",
        display: "flex",
    },
    button: {
        height: "32px",
        width: "64px",
    },
};

const EmulatorControls = () : JSX.Element => {

    const store = useStore();

    const onReset = () => {
        if (window.confirm("Are you sure you want to reset the emulation?"))
            store.reset();
    }

    return (<div style={style.buttons}>
        <button title="Step one instruction" onClick={() => store.step()} style={{letterSpacing: "-4px", ...style.button}}>&#x25B6;||</button>
        <button title="Reset emulator" onClick={onReset} style={{transform: "scaleX(-1)", fontSize: "24px", ...style.button}}>&#x21B4;</button>
    </div>);
};

export default EmulatorControls;