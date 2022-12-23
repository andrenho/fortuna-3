import React from "react";
import {faSync} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import css from "./Remote.module.scss"

export enum RemoteAction { Reset }
export enum RemoteResult { NotStarted = "notStarted", Executing = "executing", Success = "success", Failure = "failure" }

type RemoteProps = {
    result: RemoteResult,
    projectList: string[],
    output?: string,
    onAction: (action: RemoteAction, arg: string) => void,
}

const Remote : React.FC<RemoteProps> = ({ result = RemoteResult.NotStarted, projectList, output, onAction }) => {

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
            <button disabled={result === RemoteResult.Executing}>Reset computer</button>
            <button disabled={result === RemoteResult.Executing}>Upload BIOS</button>
            <button disabled={result === RemoteResult.Executing}>Upload whole project to SDCard</button>
            <button disabled={result === RemoteResult.Executing}>Upload firmware from current branch</button>
        </div>
        <div className={css.buttonRow}>
            <select>
                { projectList.map(f => <option>{ f }</option>) }
            </select>
            <button disabled={result === RemoteResult.Executing}>Upload project to SDCard</button>
        </div>
        <div>
            <pre className={preClass()}>{ output }</pre>
            { result === RemoteResult.Executing &&
                <span className={css.spin}><FontAwesomeIcon size="lg" icon={faSync} spin /></span> }
        </div>
    </div>;
};

export default Remote;