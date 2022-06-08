class FortunaEmulator {
    
    #exports
    
    async initialize(emulatorPath) {
        await fetch(`${emulatorPath}/fortuna.wasm`).then(response => response.arrayBuffer().then(buffer => WebAssembly.instantiate(buffer).then(obj => {
            this.#exports = obj.instance.exports;
            this.#exports.initialize();
        })));
    }
    
	debuggerInfo(ramBlock) {
	}
    
}

// vim: ts=4:sts=4:sw=4:noexpandtab
