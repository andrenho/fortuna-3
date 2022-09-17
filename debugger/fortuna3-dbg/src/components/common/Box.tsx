import CSS from "csstype";
import {useState} from "react";

import css from "../../css/common/Box.module.scss"

interface BoxProps {
    title: string,
}

export default function Box(props: React.PropsWithChildren<BoxProps>) : JSX.Element {

    const [open, setOpen] = useState(true);

    return (<div className={css.box}>
        <div className={css.title}><span className={`${css.arrow} ${open ?? css.arrowStyle}`} onClick={() => setOpen(v => !v)}>&#9654;</span> { props.title }</div>
        {open && props.children}
    </div>);
}