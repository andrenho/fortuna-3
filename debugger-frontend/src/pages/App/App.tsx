import React, {useState} from 'react';
import Tabs from "components/main-page/Tabs/Tabs";
import DebuggerPage from "pages/DebuggerPage/DebuggerPage";
import {observer} from "mobx-react-lite";
import ErrorMessage from "components/error-message/ErrorMessage";
import useStore from 'hooks/useStore';
import SDCardPage from 'pages/SDCardPage/SDCardPage';
import RemotePage from "pages/RemotePage/RemotePage";

const App : React.FC = observer(() => {

    const [selectedTab, setSelectedTab] = useState(0);
    const {currentError} = useStore();

    return <>
        <Tabs tabs={["Components", "SD Card", "Remote"]} selected={selectedTab} onChange={i => setSelectedTab(i)} />
        <ErrorMessage currentError={currentError} />
        <div style={{padding:"16px"}}>
            <DebuggerPage visible={selectedTab == 0} />
            {selectedTab === 1 && <SDCardPage />}
            {selectedTab === 2 && <RemotePage/>}
        </div>
    </>;
});

export default App;