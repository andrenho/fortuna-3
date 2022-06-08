class FortunaEmulator {
    
    #exports
    
    async initialize(emulatorPath) {
        await fetch(`${emulatorPath}/fortuna.wasm`).then(response => response.arrayBuffer().then(buffer => WebAssembly.instantiate(buffer).then(obj => {
            this.#exports = obj.instance.exports;
            console.log(this.#exports);
        })));
    }
    
    step() {
        console.log(this.#exports.life_meaning());
    }
    
}

// vim: ts=4:sts=4:sw=4:noexpandtab
