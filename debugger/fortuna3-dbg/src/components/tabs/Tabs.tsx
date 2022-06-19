import CSS from "csstype";
import React from "react";

const tabs : CSS.Properties = {
    display: "flex",
    flexDirection: "row",
    whiteSpace: "nowrap",
}

const tabStart : CSS.Properties = {
    borderBottom: "1px black solid",
    width: "24px",
}

const tabEnd : CSS.Properties = {
    borderBottom: "1px black solid",
    width: "100%",
}

const tab : CSS.Properties = {
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "black",
    padding: "6px 14px",
    cursor: "pointer",
    background: "lightgray",
    fontWeight: "bold",
    boxShadow: "6px 6px 6px lightgray",
}

const tabSelected : CSS.Properties = {
    ...tab,
    background: "white",
    borderWidth: "1px 1px 0 1px",
}

const tabMiddle : CSS.Properties = {
    borderBottom: "1px black solid",
    width: "24px",
}

const whiteBox : CSS.Properties = {
    background: "white",
    position: "relative",
    height: "10px",
    zIndex: "1",
}

interface TabProps {
    selected: number,
    tabs: string[],
    onChange: (selectedElement: number) => void,
}

function Tab(props: TabProps) : JSX.Element {

    return (<>
        <div style={tabs}>
            <div style={tabStart}></div>
            { props.tabs.map((text, i) => (<React.Fragment key={i}>
                <div style={props.selected === i ? tabSelected : tab} onClick={() => props.onChange(i)}>{ text }</div>
                <div style={tabMiddle} />
            </React.Fragment>)) }
            <div style={tabEnd}></div>
        </div>
        <div style={whiteBox}></div>
    </>);
}

export default Tab;