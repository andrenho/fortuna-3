import {createContext} from "react";
import {EmulatorState, Fortuna3Emulator} from "fortuna3-emu";
import {makeAutoObservable, runInAction} from "mobx";
import DebuggingInfo, {initialDebuggingInfo} from "./types/debuggingInfo";

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
        ramPage: new Uint8Array(256),
        stack: new Uint8Array(24),
        ramBanks: [],
        sdCardPage: new Uint8Array(512),
        lastError: "",
    };

    debuggingInfo: DebuggingInfo = initialDebuggingInfo();

    selectedFile?: string | undefined;

    constructor() {
        makeAutoObservable(this);
        // TODO - where are SDCard image size and type coming from?
        this.sdCardSizeInMB = 16;
        Fortuna3Emulator.initialize(`${process.env.PUBLIC_URL}/fortuna`, this.sdCardSizeInMB).then(emulator => {
            runInAction(() => {
                this.emulator = emulator;
                this.updateEmulatorState();
            });
        });
    }

    reset() {
        this.emulator!.reset();
        this.updateEmulatorState();
    }

    step() {
        this.emulator!.step();
        this.updateEmulatorState();
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

    private updateEmulatorState() : void {
        const newState = this.emulator!.getState(this.ramPage, this.sdCardPage);
        this.state = newState;
        console.debug("New state received from emulator:");
        console.debug(newState);
        this.updateSelectedFile();
    }

    private updateSelectedFile() : void {
        for (const file of this.debuggingInfo.files) {
            for (const line of this.debuggingInfo.code[file]) {
                if (line.address === this.state.cpu.pc) {
                    this.setSelectedFile(file);
                    return;
                }
            }
        }
    }
}

// @ts-ignore
export const FortunaContext = createContext<FortunaStore>();

