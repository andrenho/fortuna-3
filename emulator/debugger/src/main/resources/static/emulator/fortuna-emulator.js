class FortunaEmulator extends HTMLElement {

    #template = `
        <style>
            * { font-family: ShareTech, monospace; }
            
            .main {
                border: 1px solid black;
                padding: 16px;
                width: fit-content;
                box-shadow: 6px 6px 6px lightgray;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
            }
            
            .title {
                font-weight: bold;
                width: 200px;
                margin-bottom: 16px;
            }
            
            .cursor {
                background-color: lawngreen;
            }
            
        </style>
        
        <div class="main">
            <div class="title">Video</div>
            <div id="lines"></div>
        </div>
    `;
    
    #exports
    #spans = [];
    #lines = 20;
    #columns = 60;
    #cursor = { x: 0, y: 0 };

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = this.#template;
    }

    connectedCallback() {
        const linesElement = this.shadowRoot.getElementById("lines");
        for (let line = 0; line < this.#lines; ++line) {
            const div = document.createElement("div");
            const spans = [];
            for (let column = 0; column < this.#columns; ++column) {
                const span = document.createElement("span");
                span.innerHTML = "&nbsp;";
                div.appendChild(span);
                spans.push(span);
            }
            linesElement.appendChild(div);
            this.#spans.push(spans);
        }
        this.#updateCursor(0, 0);
    }

    #updateCursor(x, y) {
        this.#spans[this.#cursor.y][this.#cursor.x].classList.remove("cursor");
        this.#cursor = { x, y };
        this.#spans[this.#cursor.y][this.#cursor.x].classList.add("cursor");
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
