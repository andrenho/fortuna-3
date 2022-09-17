import FileChooser from "./FileChooser";
import Code from "./Code";
import useStore from "hooks/useStore";
import {observer} from "mobx-react-lite";
import React from "react";

const Debugger : React.FC = observer(() => {

    const store = useStore();

    return <div style={{display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px"}}>

        <div style={{display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: "4px"}}>
            <label htmlFor="projects">Project: </label>
            <select name="projects" style={{fontSize: "18px", height: "32px"}} value={store.selectedProject} onChange={e => store.setSelectedProject(e.target.value)}>
                { Object.keys(store.debuggingInfo.projects).map(p => <option key={`projects_${p}`} value={p}>{p}</option>) }
            </select>
        </div>

        <div style={{display: "flex"}}>
            <FileChooser selectedFile={store.selectedFile} onSelectFile={(name) => store.setSelectedFile(name)} />
            <Code selectedFile={store.selectedFile} />
        </div>

        <p style={{margin: 0, fontSize: "13px", textAlign: "right"}}>Last updated at <b>{store.lastUpdated}</b>.</p>

    </div>;
});

export default Debugger;