/*
Events:
    - step: on clicking on step button

Usage:
    <command-button id="command-button"></command-button>

    document.getElementById("command-button").addEventListener("step", () => console.log("step"));
 */

window.customElements.define("command-button", class extends HTMLElement {

    #template = `
        <style>
            .buttons {
                position: fixed;
                top: 0;
                right: 0;
                border-left: 2px solid black;
                border-bottom: 2px solid black;
                padding: 12px;
                background: white;
            }
        </style>

        <div class="buttons">
            <button id="step" title="Step one instruction" style="letter-spacing: -1px;">&#x25B6;||</button>
        </div>
    `;

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = this.#template;

        const step = this.shadowRoot.getElementById("step");
        step.addEventListener("click", () => this.dispatchEvent(new CustomEvent("step", {
            bubbles: true, composed: true, detail: "composed"
        })));
    }

});