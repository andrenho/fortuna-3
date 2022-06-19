import React, {useState} from 'react';
// import { Fortuna3Emulator } from "fortuna3-emu";
import Tabs from "./components/Tabs";
import Components from "./pages/Components";

export default function App() {

    // Fortuna3Emulator.initialize(require("fortuna3-emu/dist/fortuna.wasm")).then(emulator => console.log(emulator.life()));

    const [selectedTab, setSelectedTab] = useState(0);

    return (<>
        <Tabs tabs={["Components", "SD Card", "Documentation"]} selected={selectedTab} onChange={i => setSelectedTab(i)} />
        <div style={{padding:"16px"}}>
            {selectedTab === 0 && <Components />}
        </div>
    </>);
}