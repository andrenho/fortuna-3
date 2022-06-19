import {createContext} from "react";
import {EmulatorState, Fortuna3Emulator} from "fortuna3-emu";
import {makeAutoObservable, runInAction} from "mobx";

export default class FortunaStore {

    private emulator? : Fortuna3Emulator;

    ramPage = 0;

    state : EmulatorState = {
        ramPage: new Uint8Array(256),
    };

    constructor() {
        makeAutoObservable(this);
        Fortuna3Emulator.initialize(require("fortuna3-emu/dist/fortuna.wasm")).then(emulator => {
            runInAction(() => {
                this.emulator = emulator;
                this.state = emulator.getState(this.ramPage);
            });
        });
    }

    setRamPage(newPage: number) {
        this.ramPage = newPage;
        this.state = this.emulator!.getState(this.ramPage);
    }

}

// @ts-ignore
export const FortunaContext = createContext<FortunaStore>(undefined);

