type Fortuna3Exports = WebAssembly.Exports & {
    memory: WebAssembly.Memory;
    initialize: () => void;
    get_state: (ramPage: number, memoryByteOffset: number) => void;
};

interface Z80State {
    pc: number,
}

export interface EmulatorState {
    cpu: Z80State,
    ramPage: Uint8Array,
}

export class Fortuna3Emulator {

    private exports : Fortuna3Exports;

    private constructor() {}

    static async initialize(wasmFilePath: string) : Promise<Fortuna3Emulator> {
        const emulator = new Fortuna3Emulator();
        emulator.exports = await Fortuna3Emulator.loadWasmBinary(wasmFilePath) as Fortuna3Exports;
        emulator.exports.initialize();
        return emulator;
    }

    getState(ramPage: number) : EmulatorState {
        const state = new Uint8Array(this.exports.memory.buffer, 0, 0x400);
        this.exports.get_state(ramPage, state.byteOffset);
        return {
            cpu: {
                pc: 0x0,  // TODO
            },
            ramPage: state.slice(0x100, 0x200),
        };
    }

    private static async loadWasmBinary(wasmFilePath: string) : Promise<WebAssembly.Exports> {
        const response = await fetch(wasmFilePath);
        const buffer = await response.arrayBuffer();
        const obj = await WebAssembly.instantiate(buffer);
        return obj.instance.exports;
    }

}