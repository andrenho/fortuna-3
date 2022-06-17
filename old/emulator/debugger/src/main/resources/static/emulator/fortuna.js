async function initializeFortunaEmulator(videoElement, wasmPath, sdCardSizeInMB) {

    class Emulator {

        #videoElement
        #exports

        constructor(videoElement) {
            this.#videoElement = videoElement;
        }

        async initialize(wasmPath, sdCardSizeInMB) {
            const response = await fetch(`${wasmPath}/fortuna.wasm`);
            const buffer = await response.arrayBuffer();
            const obj = await WebAssembly.instantiate(buffer);
            this.#exports = obj.instance.exports;
            this.#exports.initialize(sdCardSizeInMB);
        }

        state(ramPage, sdCardPage) {
            const state = new Uint8Array(this.#exports.memory.buffer, 0, 0x400);
            this.#exports.get_state(ramPage, sdCardPage, state.byteOffset);

            const pair = (n) => state[n] + (state[n+1] << 8);

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
                    i: state[0x18],
                    c: state[0] & 1,
                    n: (state[0] >> 1) & 1,
                    pv: (state[0] >> 2) & 1,
                    h: (state[0] >> 4) & 1,
                    z: (state[0] >> 6) & 1,
                    s: (state[0] >> 7) & 1,
                },
                stack: state.slice(0xe8, 0x100),
                ramPage: state.slice(0x100, 0x200),
                sdCardPage: state.slice(0x200, 0x400),
            }
        }

    }

    const emulator = new Emulator(videoElement);
    await emulator.initialize(wasmPath, sdCardSizeInMB);
    return emulator;
}