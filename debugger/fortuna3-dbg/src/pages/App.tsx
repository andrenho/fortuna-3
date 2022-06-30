import React, {useState} from 'react';
import Tabs from "../components/main-page/Tabs";
import Components from "./Components";
import SDCard from "../components/sdcard/SDCard";
import {observer} from "mobx-react-lite";
import EmulatorControls from "../components/main-page/EmulatorControls";
import ErrorMessage from "../components/other/ErrorMessage";

const App = observer(() => {

    const [selectedTab, setSelectedTab] = useState(0);

    return (<>
        <EmulatorControls />
        <Tabs tabs={["Components", "SD Card", "Documentation"]} selected={selectedTab} onChange={i => setSelectedTab(i)} />
        <ErrorMessage />
        <div style={{padding:"16px"}}>
            {selectedTab === 0 && <Components />}
            {selectedTab === 1 && <SDCard />}
        </div>
    </>);
});

export default App;