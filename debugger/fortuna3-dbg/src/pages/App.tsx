import React, {useState} from 'react';
// import { Fortuna3Emulator } from "fortuna3-emu";
import Tabs from "../components/Tabs";
import Components from "./Components";

export default function App() {

    const [selectedTab, setSelectedTab] = useState(0);

    return (<>
        <Tabs tabs={["Components", "SD Card", "Documentation"]} selected={selectedTab} onChange={i => setSelectedTab(i)} />
        <div style={{padding:"16px"}}>
            {selectedTab === 0 && <Components />}
        </div>
    </>);
}