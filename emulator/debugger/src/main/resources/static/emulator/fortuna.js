class FortunaEmulator {
    
    #exports

	#memory = new WebAssembly.Memory({ initial: 256 });
    
    async initialize(emulatorPath) {
        await fetch(`${emulatorPath}/fortuna.wasm`).then(response => response.arrayBuffer().then(buffer => WebAssembly.instantiate(buffer).then(obj => {
            this.#exports = obj.instance.exports;
            this.#exports.initialize();
        })));
    }
    
	debuggerInfo(ramBlock) {
		this.#exports.ram_data(ramBlock, this.#memory);
		return {
			"ram": new Uint8Array(this.#memory.buffer.slice(0, 256)),
		}
	}
    
}

// vim: ts=4:sts=4:sw=4:noexpandtab
