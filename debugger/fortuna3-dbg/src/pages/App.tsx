import React, {useState} from 'react';
import Tabs from "../components/Tabs";
import Components from "./Components";
import useStore from "../hooks/useStore";
import {StyleSet} from "../util/types";
import SDCard from "../components/SDCard";
import {observer} from "mobx-react-lite";

const style : StyleSet = {
    error: {
        color: "red",
        fontSize: "x-large",
    }
};

const App = observer(() => {

    const { state } = useStore();

    const [selectedTab, setSelectedTab] = useState(0);

    return (<>
        <Tabs tabs={["Components", "SD Card", "Documentation"]} selected={selectedTab} onChange={i => setSelectedTab(i)} />
        <div style={style.error}>{ state.lastError }</div>
        <div style={{padding:"16px"}}>
            {selectedTab === 0 && <Components />}
            {selectedTab === 1 && <SDCard />}
        </div>
    </>);
});

export default App;