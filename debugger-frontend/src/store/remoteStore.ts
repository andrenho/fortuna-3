import {fetchBackendRemote} from "service/backendService";
import {makeAutoObservable, runInAction} from "mobx";

export enum RemoteResult { NotStarted = "notStarted", Executing = "executing", Success = "success", Failure = "failure" }

export default class RemoteStore {

    lastResult : RemoteResult = RemoteResult.NotStarted;
    output?: string;

    constructor() {
        makeAutoObservable(this);
    }

    async reset() {
        runInAction(() => this.lastResult = RemoteResult.Executing);
        try {
            const output = await fetchBackendRemote("reset");
            runInAction(() => {
                this.output = output;
                this.lastResult = RemoteResult.Success;
            });
        } catch (e) {
            runInAction(() => {
                this.output = (e as Error).message;
                this.lastResult = RemoteResult.Failure;
            });
        }
    }

    async uploadBIOS() {

    }

    async uploadFirmware() {

    }

    async uploadFullProject() {

    }

    async uploadSingleProject(projectName: string) {

    }
}