import {FortunaApi, loadApiFunctions} from "./api";

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
    i: boolean,
    c: boolean,
    n: boolean,
    pv: boolean,
    h: boolean,
    z: boolean,
    s: boolean,
}

export interface EmulatorState {
    cpu: Z80State,
    ramBanks: number[],
    ramPage: Uint8Array,
    stack: Uint8Array,
    sdCardPage: Uint8Array,
    lastError: string | undefined,
}

export class Fortuna3Emulator {

    private api : FortunaApi;
    private currentPages = 1;

    private constructor() {}

    static async initialize(wasmFilePath: string, sdCardImageSizeMB: number) : Promise<Fortuna3Emulator> {
        const emulator = new Fortuna3Emulator();

        await this.loadWasmModule(wasmFilePath);
        emulator.api = loadApiFunctions(Module);

        emulator.api.initialize(sdCardImageSizeMB);
        console.log("Emulator initialized.");

        return emulator;
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
                i: !!(state[0x18]),
                c: !!(state[0] & 1),
                n: !!((state[0] >> 1) & 1),
                pv: !!((state[0] >> 2) & 1),
                h: !!((state[0] >> 4) & 1),
                z: !!((state[0] >> 6) & 1),
                s: !!((state[0] >> 7) & 1),
            },
            ramBanks: Array.from(state.slice(0xe4, 0xe8)),
            stack: state.slice(0xe8, 0x100),
            ramPage: state.slice(0x100, 0x200),
            sdCardPage: state.slice(0x200, 0x400),
            lastError: error,
        };

        Module._free(buf);

        return result;
    }

    downloadSdCardImage() : Uint8Array {

        const bufferSize = 16 * 1024 * 1024; // this.api.compressedSDCardMaxSize();

        const buf = Module._malloc(bufferSize);
        const compressedImageSize = this.api.compressSDCard(buf, bufferSize);
        const compressedImage = new Uint8Array(Module.HEAP8.buffer, buf, compressedImageSize).slice(0);
        console.log(compressedImage);

        Module._free(buf);

        return compressedImage;

        /*
        const compressedImageSize = this.exports.compress_sdcard_image();
        console.log(compressedImageSize);

        // compress image
        if (compressedImageSize === 0) {
            this.exports.delete_compressed_sdcard_image();
            throw new Error("There was an error trying to compress image.");
        }

        const compressedImage = new Uint8Array(compressedImageSize);

        // get compressed image from C
        const pageSize = 32 * 1024;
        let page = 0;
        let sz : number;
        let currentSz = 0;
        do {
            const data = new Uint8Array(this.exports.memory.buffer, 0, pageSize);
            sz = this.exports.get_compressed_sdcard_image_page(page++, pageSize, data.byteOffset);
            console.log(sz, data);
            compressedImage.set(data.slice(0, sz), currentSz);
            currentSz += sz;
        } while (sz === pageSize);
        console.log(compressedImage.length);

        // delete compressed image
        this.exports.delete_compressed_sdcard_image();

        return compressedImage;
         */
        return new Uint8Array(0);
    }

}