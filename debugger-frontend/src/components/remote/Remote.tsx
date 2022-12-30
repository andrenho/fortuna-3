import React, {useState} from "react";
import {faSync} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import css from "./Remote.module.scss"
import {RemoteResult} from "store/remoteStore";
import {observer} from "mobx-react-lite";

export enum RemoteAction { Reset, UploadBIOS, UploadFullProject, UploadSingleProject, UploadFirmware, CleanBuild, FormatSDCard }

type RemoteProps = {
    result: RemoteResult,
    projectList: string[],
    output?: string,
    onAction: (remoteIp: string, action: RemoteAction, arg?: string) => Promise<void>,
}

const REMOTE_IP_KEY = "remote-ip";

const Remote : React.FC<RemoteProps> = observer(({ result = RemoteResult.NotStarted, projectList, output, onAction }) => {

    const [selectedProject, setSelectedProject] = useState<string>();
    const [remoteIp, setRemoteIp] = useState(window.localStorage.getItem(REMOTE_IP_KEY) || "");

    const preClass = () : string => {
        switch (result) {
            case RemoteResult.NotStarted: return css.preInvisible;
            case RemoteResult.Executing: return css.preInvisible;
            case RemoteResult.Failure: return css.preFailure;
            case RemoteResult.Success: return '';
        }
    };

    const onButton = async (action: RemoteAction) => {
        await onAction(remoteIp, action, action === RemoteAction.UploadSingleProject ? selectedProject : undefined);
    };

    const changeRemoteIp = (newIp: string) => {
        window.localStorage.setItem(REMOTE_IP_KEY, newIp);
        setRemoteIp(newIp);
    };

    return <div className={css.buttonColumn + ' ' + (result === RemoteResult.Executing ? css.executing : '')}>

        <div className={css.buttonRow}>
            <label htmlFor="ip">Remote IP</label>
            <input type="text" id="ip" value={remoteIp} onChange={e => changeRemoteIp(e.target.value)} />
        </div>

        <div className={css.buttonRow}>
            <button disabled={result === RemoteResult.Executing} onClick={() => onButton(RemoteAction.Reset)}>Reset computer</button>
            <button disabled={result === RemoteResult.Executing} onClick={() => onButton(RemoteAction.UploadBIOS)}>Install BIOS</button>
            <button disabled={result === RemoteResult.Executing} onClick={() => onButton(RemoteAction.FormatSDCard)}>Format SDCard</button>
        </div>

        <div className={css.buttonRow}>
            <select value={selectedProject} onChange={e => setSelectedProject(e.target.value)}>
                { projectList.map(f => <option key={f} value={f}>{ f }</option>) }
            </select>
            <button disabled={result === RemoteResult.Executing} onClick={() => onButton(RemoteAction.UploadSingleProject)}>Write selected project to SDCard</button>
            <button disabled={result === RemoteResult.Executing} onClick={() => onButton(RemoteAction.UploadFullProject)}>Write <b><u>whole</u></b> project to SDCard</button>
        </div>

        <div className={css.buttonRow}>
            <button disabled={result === RemoteResult.Executing} onClick={() => onButton(RemoteAction.CleanBuild)}>Clean latest build</button>
            <button disabled={result === RemoteResult.Executing} onClick={() => onButton(RemoteAction.UploadFirmware)}>Upload firmware from current branch</button>
        </div>

        <div style={{minHeight: "300px"}}>
            <pre className={preClass()}>{ output }</pre>
            { result === RemoteResult.Executing &&
                <span className={css.spin}><FontAwesomeIcon size="lg" icon={faSync} spin /></span> }
        </div>
    </div>;
});

export default Remote;