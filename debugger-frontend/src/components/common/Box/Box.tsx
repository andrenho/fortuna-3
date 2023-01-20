import React, {PropsWithChildren, useState} from "react";
import css from "./Box.module.scss"

type BoxProps = {
    title: string,
    running?: boolean,
}

const Box : React.FC<PropsWithChildren<BoxProps>> = ({ title, running = false, children }) => {

    const [open, setOpen] = useState(true);

    return <div className={css.box}>
        <div className={css.title}>
            <span
                className={`${css.arrow} ${open ? css.arrowOpen: ''}`}
                onClick={() => setOpen(v => !v)}>
                &#9654;
            </span>
            <span className={css.titleText}>{ title }</span>
        </div>
        {open && children}
        { running && <span className={css.running}>Running...</span> }
    </div>;
}

export default Box;