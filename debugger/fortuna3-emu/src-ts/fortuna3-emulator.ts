import {FinishReason, FortunaApi, loadApiFunctions} from "./api";

export interface FortunaModule extends EmscriptenModule {
    cwrap: typeof cwrap;
}
declare var Module : FortunaModule;

interface Z80State {
    af: number,
    bc: number,
    de: number,
    hl: number,
    ix: number,
    iy: number,
    pc: number,
    sp: number,
    afx: number,
    bcx: number,
    dex: number,
    hlx: number,
    i: number,
    c: boolean,
    n: boolean,
    pv: boolean,
    h: boolean,
    z: boolean,
    s: boolean,
}

export interface EmulatorState {
    cpu: Z80State,
    breakpoints: number[],
    ramBanks: number[],
    ramPage: Uint8Array,
    stack: Uint8Array,
    sdCardPage: Uint8Array,
    lastError: string | undefined,
}

export class Fortuna3Emulator {

    speedInMhz = 1;

    private api : FortunaApi;
    private constructor(private sdCardImageSizeMB) {}

    static async initialize(wasmFilePath: string) : Promise<Fortuna3Emulator> {
        const emulator = new Fortuna3Emulator(4);

        await this.loadWasmModule(wasmFilePath);
        emulator.api = loadApiFunctions(Module);

        emulator.api.initialize(emulator.sdCardImageSizeMB);

        return emulator;
    }

    step() : void {
        this.api.step();
    }

    stepOneScreenful() : FinishReason {

        const cycles = Math.floor(this.speedInMhz * 1_000_000 / 60);
        return this.api.stepCycles(cycles);
    }

    reset(sdCardSizeInMB: number) : void {
        this.sdCardImageSizeMB = sdCardSizeInMB;
        this.api.initialize(sdCardSizeInMB);
    }

    getState(ramPage: number, sdCardPage: number) : EmulatorState {

        const bufferSize = 0x600;

        const buf = Module._malloc(bufferSize);
        this.api.getState(ramPage, sdCardPage, buf);
        const state = new Uint8Array(Module.HEAP8.buffer, buf, bufferSize);

        let error : string | undefined = new TextDecoder().decode(state.slice(0x400, 0x600));
        error = error.replace(/\0.*$/g, '');  // remove nulls
        if (error === "")
            error = undefined;

        const pair = (n: number) : number => state[n] + (state[n+1] << 8);

        const result : EmulatorState = {
            cpu: {
                af: pair(0x0),
                bc: pair(0x2),
                de: pair(0x4),
                hl: pair(0x6),
                ix: pair(0x8),
                iy: pair(0xa),
                pc: pair(0xc),
                sp: pair(0xe),
                afx: pair(0x10),
                bcx: pair(0x12),
                dex: pair(0x14),
                hlx: pair(0x16),
                i: state[0x18],
                c: !!(state[0] & 1),
                n: !!((state[0] >> 1) & 1),
                pv: !!((state[0] >> 2) & 1),
                h: !!((state[0] >> 4) & 1),
                z: !!((state[0] >> 6) & 1),
                s: !!((state[0] >> 7) & 1),
            },
            breakpoints: [],
            ramBanks: Array.from(state.slice(0xe4, 0xe8)),
            stack: state.slice(0xe8, 0x100),
            ramPage: state.slice(0x100, 0x200),
            sdCardPage: state.slice(0x200, 0x400),
            lastError: error,
        };

        for (let i = 0x80; i < 0xe4; i += 2) {
            const addr = pair(i);
            if (addr !== 0)
                result.breakpoints.push(addr);
        }

        Module._free(buf);

        return result;
    }

    downloadSdCardImage() : Uint8Array {

        const bufferSize = this.sdCardImageSizeMB * 1024 * 1024;

        const buf = Module._malloc(bufferSize);
        const compressedImageSize = this.api.compressSDCard(buf, bufferSize);
        const compressedImage = new Uint8Array(Module.HEAP8.buffer, buf, compressedImageSize).slice(0);

        Module._free(buf);

        return compressedImage;
    }

    addBreakpoint(addr: number) : void {
        this.api.addBreakpoint(addr);
    }

    removeBreakpoint(addr: number) : void {
        this.api.removeBreakpoint(addr);
    }

    setRam(addr: number, data: Uint8Array) : void {
        for (let i = 0; i < data.length; ++i)
            this.api.setRam(addr + i, data[i]);
    }

    getUartPrintedChars() : string[] {

        const maxSize = this.api.maxPrintedChars();

        const buf = Module._malloc(maxSize);
        const sz = this.api.unloadPrintedChars(buf, maxSize);
        const charArray = new Uint8Array(Module.HEAP8.buffer, buf, sz);

        const r = String.fromCharCode(...charArray).split("");
        Module._free(buf);
        return r;
    }

    private static async loadWasmModule(wasmFilePath: string) : Promise<void> {
        const script = document.createElement("script");
        script.src = `${wasmFilePath}/fortuna.js`;
        script.async = true;
        document.body.appendChild(script);

        const waitForScript = async () => new Promise<void>(resolve => script.onload = () => resolve());
        await waitForScript();

        const waitForModuleInitialization = async () => new Promise<void>(resolve => Module.onRuntimeInitialized = () => resolve());
        await waitForModuleInitialization();
    }

}