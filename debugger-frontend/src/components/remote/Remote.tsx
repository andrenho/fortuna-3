import React, {useState} from "react";
import {faSync} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import css from "./Remote.module.scss"
import {RemoteResult} from "store/remoteStore";
import {observer} from "mobx-react-lite";

export enum RemoteAction { Reset, UploadBIOS, UploadFullProject, UploadSingleProject, UploadFirmware }

type RemoteProps = {
    result: RemoteResult,
    projectList: string[],
    output?: string,
    onAction: (action: RemoteAction, arg?: string) => Promise<void>,
}

const Remote : React.FC<RemoteProps> = observer(({ result = RemoteResult.NotStarted, projectList, output, onAction }) => {

    const [selectedProject, setSelectedProject] = useState<string>();

    const preClass = () : string => {
        switch (result) {
            case RemoteResult.NotStarted: return css.preInvisible;
            case RemoteResult.Executing: return css.preInvisible;
            case RemoteResult.Failure: return css.preFailure;
            case RemoteResult.Success: return '';
        }
    };

    return <div className={css.buttonColumn + ' ' + (result === RemoteResult.Executing ? css.executing : '')}>

        <div className={css.buttonRow}>
            <button disabled={result === RemoteResult.Executing} onClick={() => onAction(RemoteAction.Reset)}>Reset computer</button>
            <button disabled={result === RemoteResult.Executing} onClick={() => onAction(RemoteAction.UploadBIOS)}>Upload BIOS</button>
            <button disabled={result === RemoteResult.Executing} onClick={() => onAction(RemoteAction.UploadFullProject)}>Upload whole project to SDCard</button>
            <button disabled={result === RemoteResult.Executing} onClick={() => onAction(RemoteAction.UploadFirmware)}>Upload firmware from current branch</button>
        </div>

        <div className={css.buttonRow}>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                { projectList.map(f => <option key={f} value={f}>{ f }</option>) }
            </select>
            <button disabled={result === RemoteResult.Executing} onClick={() => onAction(RemoteAction.UploadSingleProject)}>Upload project to SDCard</button>
        </div>

        <div>
            <pre className={preClass()}>{ output }</pre>
            { result === RemoteResult.Executing &&
                <span className={css.spin}><FontAwesomeIcon size="lg" icon={faSync} spin /></span> }
        </div>
    </div>;
});

export default Remote;