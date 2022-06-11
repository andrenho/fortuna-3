async function initializeFortunaEmulator(videoElement, wasmPath) {

    class Emulator {

        #videoElement
        #exports

        constructor(videoElement) {
            this.#videoElement = videoElement;
        }

        async initialize(wasmPath) {
            const response = await fetch(`${wasmPath}/fortuna.wasm`);
            const buffer = await response.arrayBuffer();
            const obj = await WebAssembly.instantiate(buffer);
            this.#exports = obj.instance.exports;
            this.#exports.initialize();
        }

        state(ramPage) {
            const state = new Uint8Array(this.#exports.memory.buffer, 0, 0x400);
            this.#exports.get_state(ramPage,  state.byteOffset);

            return {
                cpu: {
                    pc: 0,
                    sp: 0xffff,
                },
                ramPage: state.slice(0x100, 0x200),
                stack: state.slice(0xe8, 0x100),
            }
        }

    }

    const emulator = new Emulator(videoElement);
    await emulator.initialize(wasmPath);
    return emulator;
}