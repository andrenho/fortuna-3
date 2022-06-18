import CSS from 'csstype';

const tabs : CSS.Properties = {
    display: "flex",
    flexDirection: "row",
    whiteSpace: "nowrap"
}

function Tab() : JSX.Element {
    return <div></div>;
}

function Item() : JSX.Element {
    return <div></div>;
}

Tab.Item = Item;

export default Tab;