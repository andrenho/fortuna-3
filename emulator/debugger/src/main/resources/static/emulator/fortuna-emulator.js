class FortunaEmulator extends HTMLElement {

    #template = `
        <div>Emulator</div>
    `;
    
    #exports

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = this.#template;
    }

    async initialize(wasmPath) {
        await fetch(`emulator/fortuna.wasm`).then(response => response.arrayBuffer().then(buffer => WebAssembly.instantiate(buffer).then(obj => {
            this.#exports = obj.instance.exports;
            this.#exports.initialize();
        })));
        return this;
    }

	debuggerInfo(ramPage) {
		const array = new Uint8Array(this.#exports.memory.buffer, 0, 256);
		this.#exports.ram_data(ramPage, array.byteOffset);
		return {
			ram: array,
		}
	}
    
}

window.customElements.define("fortuna-emulator", FortunaEmulator);
