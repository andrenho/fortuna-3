import FileChooser from "../code/FileChooser";
import Code from "../code/Code";
import useStore from "hooks/useStore";
import {observer} from "mobx-react-lite";
import React from "react";
import ProjectSelector from "../code/ProjectSelector";
import {faSync} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import css from './Debugger.module.scss';

const Debugger : React.FC = observer(() => {

    const store = useStore();
    const hasProjectSelected = store.selectedProject;

    let sourceLines = hasProjectSelected ? store.currentProject!.source[store.selectedFile!] : undefined;
    if (store.running)
        sourceLines = [{ line: "Running..." }];

    return <div className={css.debugger}>

        <div className={css.projectSelector}>
            <ProjectSelector
                projects={Object.keys(store.debuggingInfo.projects)}
                selectedProject={store.selectedProject!} 
                onSelectProject={p => store.setSelectedProject(p)}
            />
        </div>

        <div className={css.code}>
            <FileChooser
                selectedFile={store.selectedFile} 
                onSelectFile={(name) => store.setSelectedFile(name)} 
                fileList={hasProjectSelected ? Object.keys(store.currentProject!.source) : ["No project"]}
            />
            <Code 
                pc={store.state.cpu.pc}
                breakpoints={store.state.breakpoints}
                swapBreakpoint={n => store.swapBreakpoint(n)}
                sourceLines={sourceLines}
            />
        </div>

        <p className={css.lastUpdated}>
            Last updated at <b>{store.lastUpdated}</b>.
            { store.loading && <span style={{display: "inline-block"}}><FontAwesomeIcon icon={faSync} spin /></span> }
        </p>

    </div>;
});

export default Debugger;