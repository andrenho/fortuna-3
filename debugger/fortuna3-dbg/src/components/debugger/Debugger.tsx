import FileChooser from "../code/FileChooser";
import Code from "../code/Code";
import useStore from "hooks/useStore";
import {observer} from "mobx-react-lite";
import React from "react";
import ProjectSelector from "../code/ProjectSelector";

const Debugger : React.FC = observer(() => {

    const store = useStore();
    const hasProjectSelected = store.selectedProject;

    return <div style={{display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px"}}>

        <div style={{display: "flex", justifyContent: "flex-end", alignItems: "baseline", gap: "4px"}}>
            <ProjectSelector
                projects={Object.keys(store.debuggingInfo.projects)}
                selectedProject={store.selectedProject!} 
                onSelectProject={p => store.setSelectedProject(p)}
            />
        </div>

        <div style={{display: "flex"}}>
            <FileChooser
                selectedFile={store.selectedFile} 
                onSelectFile={(name) => store.setSelectedFile(name)} 
                fileList={hasProjectSelected ? Object.keys(store.currentProject!.source) : ["No project"]}
            />
            <Code 
                pc={store.state.cpu.pc}
                breakpoints={store.state.breakpoints}
                swapBreakpoint={n => store.swapBreakpoint(n)}
                sourceLines={hasProjectSelected ? store.currentProject!.source[store.selectedFile!] : undefined}
            />
        </div>

        <p style={{margin: 0, fontSize: "13px", textAlign: "right"}}>Last updated at <b>{store.lastUpdated}</b>.</p>

    </div>;
});

export default Debugger;