type Fortuna3Exports = WebAssembly.Exports & {
    memory: WebAssembly.Memory;
    initialize: (sdCardImageSizeMB: number) => boolean;
    get_state: (ramPage: number, sdCardPage: number, memoryByteOffset: number) => void;
    compress_sdcard_image: () => number;
    get_compressed_sdcard_image_page: (page: number, pageSize: number, memoryByteOffset: number) => number;
    delete_compressed_sdcard_image: () => void;
};

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

    private exports : Fortuna3Exports;
    private currentPages = 1;

    private constructor() {}

    static async initialize(wasmFilePath: string, sdCardImageSizeMB: number) : Promise<Fortuna3Emulator> {
        const emulator = new Fortuna3Emulator();
        emulator.exports = await Fortuna3Emulator.loadWasmBinary(wasmFilePath) as Fortuna3Exports;
        emulator.exports.initialize(sdCardImageSizeMB);
        return emulator;
    }

    getState(ramPage: number, sdCardPage: number) : EmulatorState {
        const state = new Uint8Array(this.exports.memory.buffer, 0, 0x600);
        this.exports.get_state(ramPage, sdCardPage, state.byteOffset);

        const pair = (n: number) : number => state[n] + (state[n+1] << 8);

        let error : string | undefined = new TextDecoder().decode(state.slice(0x400, 0x600));
        error = error.replace(/\0.*$/g, '');  // remove nulls
        if (error === "")
            error = undefined;

        return {
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
    }

    downloadSdCardImage() : Uint8Array {
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
    }

    private static async loadWasmBinary(wasmFilePath: string) : Promise<WebAssembly.Exports> {
        const response = await fetch(wasmFilePath);
        const buffer = await response.arrayBuffer();
        const obj = await WebAssembly.instantiate(buffer);
        return obj.instance.exports;
    }

}