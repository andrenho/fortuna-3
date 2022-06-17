type Fortuna3Exports = WebAssembly.Exports & {
    life: () => void;
};

export class Fortuna3Emulator {

    private exports : Fortuna3Exports;

    private constructor() {}

    static async initialize(wasmFilePath: string) : Promise<Fortuna3Emulator> {
        const emulator = new Fortuna3Emulator();
        emulator.exports = await Fortuna3Emulator.loadWasmBinary(wasmFilePath) as Fortuna3Exports;
        return emulator;
    }

    life() : number {
        // @ts-ignore
        return this.exports.life();
    }

    private static async loadWasmBinary(wasmFilePath: string) : Promise<WebAssembly.Exports> {
        const response = await fetch(wasmFilePath);
        const buffer = await response.arrayBuffer();
        const obj = await WebAssembly.instantiate(buffer);
        return obj.instance.exports;
    }

}