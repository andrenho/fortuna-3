import {createContext} from "react";
import {EmulatorState, Fortuna3Emulator} from "fortuna3-emu";
import {makeAutoObservable, runInAction} from "mobx";
import DebuggingInfo, {initialDebuggingInfo, SourceProject} from "./types/debuggingInfo";
import {fetchBackendCompilation, fetchBackendCrc} from "service/backendService";
import UartTerminal from "./types/uartTerminal";
import { FinishReason } from "fortuna3-emu/dist/api";

const terminalSize = {
    w: 60,
    h: 20
};

export default class FortunaStore {

    private emulator? : Fortuna3Emulator;

    ramPage = 0;
    sdCardPage = 0;

    state : EmulatorState = {
        cpu: {
            af: 0, bc: 0, de: 0, hl: 0, ix: 0, iy: 0, pc: 0, sp: 0, afx: 0, bcx: 0, dex: 0, hlx: 0, i: 0,
            c: false, n: false, pv: false, h: false, z: false, s: false,
        },
        computeUnit: { p: 0, q: 0, r: 0 },
        breakpoints: [],
        ramPage: new Uint8Array(256),
        stack: new Uint8Array(24),
        ramBank: 0,
        sdCardPage: new Uint8Array(512),
        lastError: "",
    };

    debuggingInfo: DebuggingInfo = initialDebuggingInfo();

    uartTerminal = new UartTerminal(terminalSize.h, terminalSize.w);

    selectedFile?: string | undefined;
    selectedProject?: string | undefined;

    lastCompilationHash: number = 0;

    currentError: string | undefined;

    lastUpdated = "never";
    loading = false;

    running = false;

    constructor() {
        makeAutoObservable(this);
        // TODO - where are SDCard image size and type coming from?
        Fortuna3Emulator.initialize(`${process.env.PUBLIC_URL}/fortuna`).then((emulator : Fortuna3Emulator) => {
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

    reset() : void {
        this.emulator!.reset(this.debuggingInfo.sdCardSizeInMB);
        if (this.selectedProject && this.selectedProject === "bios") {
            const bios = Uint8Array.from(window.atob(this.currentProject!.binary), c => c.charCodeAt(0));
            this.emulator!.setRam(0, bios);
        } else {
            this.currentError = "A BIOS is not included in the project.";
        }
        this.updateState();
        this.uartTerminal.reset();
    }

    step() : void {
        this.emulator!.step();
        this.updateState();
    }

    stepOneScreenful() : void {
        this.emulator!.stepOneScreenful();
        this.updateState();
    }

    run() : void {
        if (this.running)
            return;

        console.log("Execution started.");
        this.running = true;

        const screenfulStep = (elapsed: DOMHighResTimeStamp) => {

            const result = this.emulator!.stepTime(elapsed);
            if (result === FinishReason.Breakpoint) {
                console.log("Breakpoint hit.");
                this.stopExecution();
            } else {
                this.updateTerminal();
            }

            if (this.running) {
                window.requestAnimationFrame(screenfulStep);
            }
        };

        window.requestAnimationFrame(screenfulStep);
    }

    stopExecution() : void {
        if (!this.running)
            return;

        this.running = false;
        this.updateEmulatorState();

        console.log("Execution stopped.");
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

    setSelectedFile(file: string | undefined) : void {
        console.debug(`Selected file updated to "${file}"`);
        this.selectedFile = file;
    }

    setSelectedProject(project: string) : void {
        console.debug(`Selected project updated to "${project}"`);
        this.selectedProject = project;
        this.setSelectedFile(this.debuggingInfo.projects[project].mainSourceFile);
    }

    swapBreakpoint(addr: number) : void {
        if (this.state.breakpoints.includes(addr))
            this.emulator!.removeBreakpoint(addr);
        else
            this.emulator!.addBreakpoint(addr);
        this.updateEmulatorState();
    }

    updateTerminal() : void {
        const printedChars = this.emulator!.getUartPrintedChars();
        this.uartTerminal.addChars(printedChars);
    }

    private updateState() : void {
        this.updateEmulatorState();
        this.updateSelectedFile();
    }

    private updateEmulatorState() : void {
        const newState = this.emulator!.getState(this.ramPage, this.sdCardPage);
        this.state = newState;
        this.currentError = this.state.lastError;
        this.updateTerminal();
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
        try {
            const newHash = await fetchBackendCrc();

            if (newHash !== this.lastCompilationHash) {

                runInAction(() => this.loading = true);
                const debuggingInfo = await fetchBackendCompilation();
                runInAction(() => this.loading = false);

                console.debug("Debugging info updated from backend:");
                console.debug(debuggingInfo);

                runInAction(() => {
                    this.lastCompilationHash = newHash;
                    this.lastUpdated = new Date().toLocaleTimeString();
                    if (debuggingInfo.success) {
                        this.currentError = undefined;
                        this.debuggingInfo = debuggingInfo;
                        this.setSelectedProject("bios");
                        this.reset();
                    } else {
                        this.currentError = debuggingInfo.errorMessage;
                    }
                });
            }
        } catch (e) {
            runInAction(() => { 
                this.loading = false;
                this.currentError = (e as Error).message;
            });
        }
    }
}

// @ts-ignore
export const FortunaContext = createContext<FortunaStore>();

