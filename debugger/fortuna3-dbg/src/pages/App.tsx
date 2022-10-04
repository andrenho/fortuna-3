import React, {useState} from 'react';
import Tabs from "../components/main-page/Tabs";
import DebuggerPage from "./DebuggerPage";
import {observer} from "mobx-react-lite";
import ErrorMessage from "components/error-message/ErrorMessage";
import Documentation from "./Documentation";
import useStore from 'hooks/useStore';
import SDCardPage from './SDCardPage';

const App : React.FC = observer(() => {

    const [selectedTab, setSelectedTab] = useState(0);
    const {currentError} = useStore();

    return <>
        <Tabs tabs={["Components", "SD Card", "Documentation"]} selected={selectedTab} onChange={i => setSelectedTab(i)} />
        <ErrorMessage currentError={currentError} />
        <div style={{padding:"16px"}}>
            {selectedTab === 0 && <DebuggerPage />}
            {selectedTab === 1 && <SDCardPage />}
            {selectedTab === 2 && <Documentation />}
        </div>
    </>;
});

export default App;