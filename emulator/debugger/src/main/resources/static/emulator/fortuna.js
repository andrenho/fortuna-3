class FortunaEmulator {
    
    #exports

    async initialize(emulatorPath, videoElement) {
        await fetch(`${emulatorPath}/fortuna.wasm`).then(response => response.arrayBuffer().then(buffer => WebAssembly.instantiate(buffer).then(obj => {
            this.#exports = obj.instance.exports;
            this.#exports.initialize();
        })));
    }
    
	debuggerInfo(ramPage) {
		const array = new Uint8Array(this.#exports.memory.buffer, 0, 256);
		this.#exports.ram_data(ramPage, array.byteOffset);
		return {
			ram: array,
		}
	}
    
}

// vim: ts=4:sts=4:sw=4:noexpandtab
