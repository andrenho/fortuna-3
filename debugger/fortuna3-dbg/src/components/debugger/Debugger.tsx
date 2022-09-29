import FileChooser from "../code/FileChooser";
import Code from "../code/Code";
import useStore from "hooks/useStore";
import {observer} from "mobx-react-lite";
import React from "react";
import ProjectSelector from "../code/ProjectSelector";

const Debugger : React.FC = observer(() => {

    const store = useStore();

    return <div style={{display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px"}}>

        <div style={{display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: "4px"}}>
            <ProjectSelector />
        </div>

        <div style={{display: "flex"}}>
            <FileChooser selectedFile={store.selectedFile} onSelectFile={(name) => store.setSelectedFile(name)} />
            <Code selectedFile={store.selectedFile} />
        </div>

        <p style={{margin: 0, fontSize: "13px", textAlign: "right"}}>Last updated at <b>{store.lastUpdated}</b>.</p>

    </div>;
});

export default Debugger;