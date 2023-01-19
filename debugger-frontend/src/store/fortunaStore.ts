import {createContext} from "react";
import {makeAutoObservable, runInAction} from "mobx";
import {Buffer} from "buffer";
import DebuggingInfo, {initialDebuggingInfo, SourceLine, SourceProject} from "./types/debuggingInfo";
import {fetchBackendCompilation, fetchBackendCrc, fetchPutOptions} from "service/backendService";
import UartTerminal from "./types/uartTerminal";
import Filesystem from "./filesystem";
import {EmulatorState, Fortuna3Emulator} from "api/fortuna3-emulator";
import {FinishReason} from "api/api";
import RemoteStore from "store/remoteStore";
import Options, {optionsLoadFromLocal, optionsSaveToLocal} from "store/types/options";

const terminalSize = {
    w: 60,
    h: 20
};

export default class FortunaStore {

    private emulator? : Fortuna3Emulator;

    ramPage = 0;
    sdCardPage = 0;
    eepromPage = 0;

    state : EmulatorState = {
        cpu: {
            af: 0, bc: 0, de: 0, hl: 0, ix: 0, iy: 0, pc: 0, sp: 0, afx: 0, bcx: 0, dex: 0, hlx: 0, i: 0,
            c: false, n: false, pv: false, h: false, z: false, s: false,
        },
        computeUnit: { p: 0, q: 0, r: 0 },
        breakpoints: [],
        ramPage: new Uint8Array(256),
        eepromPage: new Uint8Array(256),
        stack: new Uint8Array(24),
        ramBank: 0,
        sdCardPage: new Uint8Array(512),
        lcd: [" ".repeat(16), " ".repeat(16)],
        rtc: { year: 2000, month: 1, day: 1, hours: 0, minutes: 0, seconds: 0 },
        lastError: "",
    };

    filesystem? : Filesystem;
    remote = new RemoteStore();

    debuggingInfo: DebuggingInfo = initialDebuggingInfo();

    uartTerminal = new UartTerminal(terminalSize.h, terminalSize.w);

    selectedFile: string | undefined;
    selectedProject: string | undefined;

    lastCompilationHash: number = 0;

    currentError: string | undefined;
    lastKeyPressed: string | undefined;

    lastUpdated = "never";
    loading = false;

    running = false;

    options : Options = optionsLoadFromLocal();

    constructor() {
        makeAutoObservable(this);
        // TODO - where are SDCard image size and type coming from?
        Fortuna3Emulator.initialize(`${process.env.PUBLIC_URL}/fortuna`).then((emulator : Fortuna3Emulator) => {
            runInAction(() => {
                this.emulator = emulator;
                this.filesystem = new Filesystem(emulator);
                this.updateEmulatorState();
                this.updateSelectedFile();
            });
        });
        this.updateOptions(this.options).then();  // set initial options
        setInterval(() => this.updateDebuggingInfoFromBackend(), 1000);
    }

    get currentProject() : SourceProject | undefined {
        if (this.selectedProject === undefined)
            return undefined;
        return this.debuggingInfo.projects[this.selectedProject];
    }

    reset() : void {
        this.emulator!.reset(this.debuggingInfo.debuggerSetup.sdCardSizeInMB);
        if (this.selectedProject && this.selectedProject === "BIOS") {
            const bios = Uint8Array.from(window.atob(this.currentProject!.binary), c => c.charCodeAt(0));
            this.emulator!.setRam(0x0, bios);
            this.writeProjectsToSdCard(this.debuggingInfo.projects);
        } else {
            this.currentError = "A BIOS is not included in the project.";
        }
        this.updateState();
        this.uartTerminal.reset();
        this.lastKeyPressed = undefined;
        this.filesystem?.updateFromEmulator(undefined, 0);
    }

    step() : void {
        const currentLine = this.currentLine();
        if (currentLine === undefined) {
            this.emulator!.step();
        } else {
            // keep stepping until out of instruction (for macros)
            const origPC = this.state.cpu.pc;
            let pc = origPC;
            while (currentLine.addresses?.includes(pc)) {
                pc = this.emulator!.step();
                if (pc === origPC)   // avoid loops
                    break;
            }
        }
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

            const result = this.emulator!.stepTime(16.6);

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
        this.updateState();

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

    setEepromPage(newPage: number) : void {
        this.eepromPage = newPage;
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

    keypress(chr: number) : void {
        if (chr === 0)
            this.lastKeyPressed = undefined;
        else
            this.lastKeyPressed = String.fromCharCode(chr);
        this.emulator!.keypress(chr);
    }

    async updateOptions(newOptions: Options) : Promise<void> {
        this.options = await fetchPutOptions(newOptions);
        optionsSaveToLocal(this.options);
    }

    private updateState() : void {
        this.updateEmulatorState();
        this.updateSelectedFile();
    }

    private updateEmulatorState() : void {
        const newState = this.emulator!.getState(this.ramPage, this.sdCardPage, this.eepromPage);
        this.state = newState;
        this.currentError = this.state.lastError;

        this.updateTerminal();
        console.debug("New state received from emulator:");
        console.debug(newState);
    }

    private updateSelectedFile() : void {
        for (const [projectName, project] of Object.entries(this.debuggingInfo.projects)) {
            for (const file of Object.keys(project.source)) {
                const source = project.source[file];
                for (const line of source) {
                    if (line.addresses && line.addresses.includes(this.state.cpu.pc)) {
                        this.setSelectedProject(projectName);
                        this.setSelectedFile(file);
                        return;
                    }
                }
            }

        }

        if (this.currentProject === undefined)
            return;
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
                        this.initializeEmulator(debuggingInfo);
                        if (debuggingInfo.debuggerSetup.breakpoints && debuggingInfo.debuggerSetup.breakpoints.length > 0) {
                            debuggingInfo.debuggerSetup.breakpoints.forEach(b => this.swapBreakpoint(b));
                            if (debuggingInfo.debuggerSetup.runOnLoad)
                                this.run();
                        }
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

    private async initializeEmulator(debuggingInfo: DebuggingInfo) : Promise<void> {
        this.currentError = undefined;
        this.debuggingInfo = debuggingInfo;
        this.setSelectedProject("BIOS");
        this.writeProjectsToSdCard(debuggingInfo.projects);
        this.reset();
    }

    private writeProjectsToSdCard(projects: { [p: string]: SourceProject }) {
        for (const filename of Object.keys(projects).filter(f => f !== "BIOS"))
            this.filesystem!.createFile(`/${filename}`, Buffer.from(projects[filename].binary, 'base64'));
    }

    private currentLine() : SourceLine | undefined {
        if (this.currentProject && this.selectedFile) {
            const lines = this.currentProject.source[this.selectedFile]
                .filter(sl => sl.addresses && sl.addresses.includes(this.state.cpu.pc));
            if (lines.length > 0)
                return lines[0];
        }
        return undefined;
    }

}

// @ts-ignore
export const FortunaContext = createContext<FortunaStore>();

