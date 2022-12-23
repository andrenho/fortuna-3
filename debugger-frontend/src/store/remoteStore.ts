import {fetchBackendRemote} from "service/backendService";
import {makeAutoObservable, runInAction} from "mobx";

export enum RemoteResult { NotStarted = "notStarted", Executing = "executing", Success = "success", Failure = "failure" }

export default class RemoteStore {

    lastResult : RemoteResult = RemoteResult.NotStarted;
    output?: string;

    constructor() {
        makeAutoObservable(this);
    }

    private async sendBackendRequest(request: string) : Promise<void> {
        runInAction(() => this.lastResult = RemoteResult.Executing);
        try {
            const output = await fetchBackendRemote(request);
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

    async reset() : Promise<void> {
        return this.sendBackendRequest("reset");
    }

    async uploadBIOS() : Promise<void> {
        return this.sendBackendRequest("upload-bios");
    }

    async uploadFirmware() : Promise<void> {
        return this.sendBackendRequest("upload-firmware");
    }

    async uploadFullProject() : Promise<void> {
        return this.sendBackendRequest("upload-projects");
    }

    async uploadSingleProject(projectName: string) : Promise<void> {
        return this.sendBackendRequest(`upload-project/${projectName}`);
    }
}