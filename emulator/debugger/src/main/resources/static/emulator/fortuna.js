async function initializeFortunaEmulator(videoElement, wasmPath) {

    class Emulator {

        #videoElement
        #ram = new Uint8Array(64 * 1024);   // TODO - remove

        constructor(videoElement) {
            this.#videoElement = videoElement;
            window.crypto.getRandomValues(this.#ram);  // TODO - remove
        }

        async initialize(wasmPath) {
            // TODO
        }

        state(ramPage) {   // TODO - replace by wasm call
            return {
                cpu: {
                    pc: 0,
                    sp: 0xffff,
                },
                ramPage: this.#ram.slice(ramPage * 256, (ramPage + 1) * 256),
            }
        }

    }

    const emulator = new Emulator(videoElement);
    await emulator.initialize(wasmPath);
    return emulator;
}