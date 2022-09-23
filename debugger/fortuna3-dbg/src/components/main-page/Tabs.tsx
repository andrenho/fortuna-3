import React from "react";
import css from "./Tabs.module.scss";

type TabProps = {
    selected: number,
    tabs: string[],
    onChange: (selectedElement: number) => void,
}

const Tab : React.FC<TabProps> = ({ selected, tabs, onChange }) => {

    return <>
        <div className={css.tabs}>
            <div className={css.tabStart}></div>
            { tabs.map((text, i) => (<React.Fragment key={i}>
                <div className={selected === i ? css.tabSelected : css.tab} onClick={() => onChange(i)}>{ text }</div>
                <div className={css.tabMiddle} />
            </React.Fragment>)) }
            <div className={css.tabEnd}></div>
        </div>
        <div className={css.whiteBox}></div>
    </>;
}

export default Tab;