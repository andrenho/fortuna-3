type Fortuna3Exports = WebAssembly.Exports & {
    memory: WebAssembly.Memory;
    initialize: (sdCardImageSizeMB: number, fatType: 16 | 32) => void;
    get_state: (ramPage: number, sdCardPage: number, memoryByteOffset: number) => void;
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
}

export class Fortuna3Emulator {

    private exports : Fortuna3Exports;

    private constructor() {}

    static async initialize(wasmFilePath: string, sdCardImageSizeMB: number, fatType: 16 | 32) : Promise<Fortuna3Emulator> {
        const emulator = new Fortuna3Emulator();
        emulator.exports = await Fortuna3Emulator.loadWasmBinary(wasmFilePath) as Fortuna3Exports;
        emulator.exports.initialize(sdCardImageSizeMB, fatType);
        return emulator;
    }

    getState(ramPage: number, sdCardPage: number) : EmulatorState {
        const state = new Uint8Array(this.exports.memory.buffer, 0, 0x400);
        this.exports.get_state(ramPage, sdCardPage, state.byteOffset);

        const pair = (n: number) : number => state[n] + (state[n+1] << 8);

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
        };
    }

    private static async loadWasmBinary(wasmFilePath: string) : Promise<WebAssembly.Exports> {
        const response = await fetch(wasmFilePath);
        const buffer = await response.arrayBuffer();
        const obj = await WebAssembly.instantiate(buffer);
        return obj.instance.exports;
    }

}