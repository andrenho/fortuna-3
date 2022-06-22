import React, {useState} from 'react';
import Tabs from "../components/Tabs";
import Components from "./Components";
import useStore from "../hooks/useStore";
import {StyleSet} from "../util/types";
import SDCard from "../components/SDCard";

const style : StyleSet = {
    error: {
        color: "red",
        fontSize: "x-large",
    }
};

export default function App() {

    const { state } = useStore();

    const [selectedTab, setSelectedTab] = useState(0);

    return (<>
        <Tabs tabs={["Components", "SD Card", "Documentation"]} selected={selectedTab} onChange={i => setSelectedTab(i)} />
        { state.lastError ?? <div style={style.error}>{ state.lastError }</div> }
        <div style={{padding:"16px"}}>
            {selectedTab === 0 && <Components />}
            {selectedTab === 1 && <SDCard />}
        </div>
    </>);
}