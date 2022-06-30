import {createContext} from "react";
import {EmulatorState, Fortuna3Emulator} from "fortuna3-emu";
import {makeAutoObservable, runInAction} from "mobx";
import DebuggingInfo, {initialDebuggingInfo, SourceProject} from "./types/debuggingInfo";
import {fetchBackendCompilation, fetchBackendCrc} from "../service/backendService";

export default class FortunaStore {

    private emulator? : Fortuna3Emulator;

    ramPage = 0;
    sdCardPage = 0;
    sdCardSizeInMB = 0;

    state : EmulatorState = {
        cpu: {
            af: 0, bc: 0, de: 0, hl: 0, ix: 0, iy: 0, pc: 0, sp: 0, afx: 0, bcx: 0, dex: 0, hlx: 0, i: 0,
            c: false, n: false, pv: false, h: false, z: false, s: false,
        },
        breakpoints: [],
        ramPage: new Uint8Array(256),
        stack: new Uint8Array(24),
        ramBanks: [],
        sdCardPage: new Uint8Array(512),
        lastError: "",
    };

    debuggingInfo: DebuggingInfo = initialDebuggingInfo();

    selectedFile?: string | undefined;
    selectedProject?: string | undefined;

    lastCompilationHash: number = 0;

    constructor() {
        makeAutoObservable(this);
        // TODO - where are SDCard image size and type coming from?
        this.sdCardSizeInMB = 16;
        Fortuna3Emulator.initialize(`${process.env.PUBLIC_URL}/fortuna`, this.sdCardSizeInMB).then(emulator => {
            runInAction(() => {
                this.emulator = emulator;
                this.updateEmulatorState();
                this.updateSelectedFile();
            });
        });

        setInterval(() => this.updateDebuggingInfoFromBackend(), 1000);
    }

    get currentProject() : SourceProject | undefined {
        if (this.selectedProject === undefined)
            return undefined;
        return this.debuggingInfo.projects[this.selectedProject];
    }

    reset() {
        this.emulator!.reset();
        this.updateEmulatorState();
        this.updateSelectedFile();
    }

    step() {
        this.emulator!.step();
        this.updateEmulatorState();
        this.updateSelectedFile();
    }

    setRamPage(newPage: number) : void {
        this.ramPage = newPage;
        this.updateEmulatorState();
    }

    setSdCardPage(newPage: number) : void {
        this.sdCardPage = newPage;
        this.updateEmulatorState();
    }

    downloadSdCardImage() : Uint8Array {
        const bytes = this.emulator!.downloadSdCardImage();
        this.updateEmulatorState();  // update errors
        return bytes;
    }

    setSelectedFile(file: string | undefined) {
        console.debug(`Selected file updated to "${file}"`);
        this.selectedFile = file;
    }

    setSelectedProject(project: string) {
        console.debug(`Selected project updated to "${project}"`);
        this.selectedProject = project;
        this.setSelectedFile(this.debuggingInfo.projects[project].mainSourceFile);
    }

    swapBreakpoint(addr: number) {
        if (this.state.breakpoints.includes(addr))
            this.emulator!.removeBreakpoint(addr);
        else
            this.emulator!.addBreakpoint(addr);
        this.updateEmulatorState();
    }

    private updateEmulatorState() : void {
        const newState = this.emulator!.getState(this.ramPage, this.sdCardPage);
        this.state = newState;
        console.debug("New state received from emulator:");
        console.debug(newState);
    }

    private updateSelectedFile() : void {
        if (this.currentProject === undefined)
            return;
        for (const file of Object.keys(this.currentProject.source)) {
            const source = this.currentProject.source[file];
            for (const line of source) {
                if (line.address === this.state.cpu.pc) {
                    this.setSelectedFile(file);
                    return;
                }
            }
        }
    }

    private async updateDebuggingInfoFromBackend() : Promise<void> {
        const newHash = await fetchBackendCrc();
        if (newHash !== this.lastCompilationHash) {
            const debuggingInfo = await fetchBackendCompilation();
            console.debug("Debugging info updated from backend:");
            console.debug(debuggingInfo);
            this.reset();
            runInAction(() => {
                this.lastCompilationHash = newHash;
                this.debuggingInfo = debuggingInfo;
                this.setSelectedProject("bios");
            });
        }
    }
}

// @ts-ignore
export const FortunaContext = createContext<FortunaStore>();

