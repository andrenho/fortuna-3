/*
Attributes:
    - data: comma separated list of words (2-bytes)

Usage:
    <memory-stack id="stack" data="12443,34158,2312"></memory-stack>

    const ram = new Uint8Array(64 * 1024);
    window.crypto.getRandomValues(ram);
    document.getElementById("stack").setAttribute("data", toWords(ram.slice(0, 24)).toString());
*/

window.customElements.define("memory-stack", class extends HTMLElement {

    #template = `
        <style>
            .main {
                padding-top: 12px;
                display: grid;
                grid-template-columns: auto auto;
                grid-template-rows: auto auto;
                justify-content: start;
            }

            .title {
                font-weight: bold;
                padding-right: 12px;
            }

            .arrow {
                grid-column: 2;
                font-weight: bold;
                font-size: 10px;
            }
        </style>

        <div class="main">
            <div class="title">Stack:</div>
            <div class="values"><span id="data"></span></div>
            <div class="arrow">PUSH <span style="letter-spacing: -2px;">--&gt;</span></div>
        </div>
    `;

    constructor() {
        super();
        this.attachShadow({mode: "open"})
        this.shadowRoot.innerHTML = this.#template;
    }

    static get observedAttributes() {
        return ["data"];
    }

    attributeChangedCallback(prop, old, newValue) {
        if (prop === "data") {
            this.shadowRoot.getElementById("data").innerText = newValue.split(",").map(v => hex(parseInt(v ), 4)).join(" ");
        }
    }

});