import React from "react";
import useStore from "../../hooks/useStore";
import css from "css/main-page/EmulatorControls.module.scss";

const Spacing = () => <div style={{width: "8px"}}></div>;

const EmulatorControls : React.FC = () => {

    const store = useStore();

    const onReset = () => {
        if (window.confirm("Are you sure you want to reset the emulation?"))
            store.reset();
    }

    return (<div className={css.buttons}>
        <button title="Run" onClick={() => store.run()} className={css.button}>&#x25B6;</button>
        <button title="Step one instruction" onClick={() => store.step()} className={css.button} style={{letterSpacing: "-4px",}}>&#x25B6;||</button>
        <button title="Step one screenful" onClick={() => store.stepOneScreenful()} className={css.button}>&#x1f4fa;</button>
        <Spacing />
        <button title="Reset emulator" onClick={onReset} className={css.button} style={{transform: "scaleX(-1)", fontSize: "24px"}}>&#x21B4;</button>
    </div>);
};

export default EmulatorControls;