import {createContext} from "react";
import {EmulatorState, Fortuna3Emulator} from "fortuna3-emu";
import {makeAutoObservable, runInAction} from "mobx";

export default class FortunaStore {

    private emulator? : Fortuna3Emulator;

    ramPage = 0;

    state : EmulatorState = {
        cpu: {
            af: 0, bc: 0, de: 0, hl: 0, ix: 0, iy: 0, pc: 0, sp: 0, afx: 0, bcx: 0, dex: 0, hlx: 0,
            i: false, c: false, n: false, pv: false, h: false, z: false, s: false,
        },
        ramPage: new Uint8Array(256),
        stack: new Uint8Array(24),
    };

    constructor() {
        makeAutoObservable(this);
        Fortuna3Emulator.initialize(require("fortuna3-emu/dist/fortuna.wasm")).then(emulator => {
            runInAction(() => {
                this.emulator = emulator;
                this.updateEmulatorState();
            });
        });
    }

    setRamPage(newPage: number) : void {
        this.ramPage = newPage;
        this.updateEmulatorState();
    }

    private updateEmulatorState() : void {
        this.state = this.emulator!.getState(this.ramPage);
    }

}

// @ts-ignore
export const FortunaContext = createContext<FortunaStore>();

