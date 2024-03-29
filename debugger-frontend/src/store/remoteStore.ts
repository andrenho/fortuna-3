import {fetchBackendRemote} from "service/backendService";
import {makeAutoObservable, runInAction} from "mobx";

export enum RemoteResult { NotStarted = "notStarted", Executing = "executing", Success = "success", Failure = "failure" }

export default class RemoteStore {

    lastResult : RemoteResult = RemoteResult.NotStarted;
    output?: string;

    constructor() {
        makeAutoObservable(this);
    }

    private async sendBackendRequest(remoteIp: string, request: string) : Promise<void> {
        runInAction(() => this.lastResult = RemoteResult.Executing);
        try {
            const output = await fetchBackendRemote(remoteIp, request);
            runInAction(() => {
                this.output = output.replaceAll("<EOL>", "\n");
                this.lastResult = RemoteResult.Success;
            });
        } catch (e) {
            runInAction(() => {
                this.output = (e as Error).message.replaceAll("<EOL>", "\n");
                this.lastResult = RemoteResult.Failure;
            });
        }
    }

    async reset(remoteIp: string) : Promise<void> {
        return this.sendBackendRequest(remoteIp, "reset");
    }

    async uploadBIOS(remoteIp: string) : Promise<void> {
        return this.sendBackendRequest(remoteIp, "upload-bios");
    }

    async formatSDCard(remoteIp: string) {
        return this.sendBackendRequest(remoteIp, "format-sdcard");
    }

    async uploadFullProject(remoteIp: string) : Promise<void> {
        return this.sendBackendRequest(remoteIp, "upload-projects");
    }

    async uploadSingleProject(remoteIp: string, projectName: string) : Promise<void> {
        return this.sendBackendRequest(remoteIp, `upload-project/${projectName}`);
    }

    async cleanLatestBuild(remoteIp: string) : Promise<void> {
        return this.sendBackendRequest(remoteIp, "clean-build");
    }

    async uploadFirmware(remoteIp: string) : Promise<void> {
        return this.sendBackendRequest(remoteIp, "upload-firmware");
    }
}