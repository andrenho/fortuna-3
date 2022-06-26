import CSS from "csstype";
import {useState} from "react";

const box : CSS.Properties = {
    border: "1px solid black",
    padding: "16px",
    width: "fit-content",
    boxShadow: "6px 6px 6px lightgray",
    marginBottom: "24px",
};

const title : CSS.Properties = {
    fontWeight: "bold",
    marginBottom: "16px",
};

const arrow : CSS.Properties = {
    cursor: "pointer",
    display: "inline-block",
};

const arrowOpen : CSS.Properties = {
    transform: "rotate(90deg)",
};

interface BoxProps {
    title: string,
}

export default function Box(props: React.PropsWithChildren<BoxProps>) : JSX.Element {

    const [open, setOpen] = useState(true);

    let arrowStyle : CSS.Properties = { ...arrow };
    if (open)
        arrowStyle = { ...arrow, ...arrowOpen };

    return (<div style={box}>
        <div style={title}><span style={arrowStyle} onClick={() => setOpen(v => !v)}>&#9654;</span> { props.title }</div>
        {open && props.children}
    </div>);
}