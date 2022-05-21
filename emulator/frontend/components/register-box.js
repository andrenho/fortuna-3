window.customElements.define("register-box", class extends HTMLElement {

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
                margin-bottom: 24px;
            }
            
            .container {
                display: grid;
                grid-template-columns: auto auto;
                justify-content: start;
                column-gap: 6px;
            }
        </style>
        
        <div class="main">
            <div id="title" class="title">Title here</div>
            <div class="container">
                <slot></slot>
            </div>
        </div>
    `;

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = this.#template;
    }

    static get observedAttributes() {
        return ["title"];
    }

    attributeChangedCallback(prop, old, newValue) {
        switch (prop) {
            case "title":
                this.shadowRoot.getElementById("title").innerText = newValue;
                break;
        }
    }
});


window.customElements.define("register-value", class extends HTMLElement {

    #template = `
        <style>
            * { font-family: ShareTech, monospace; }
        </style>
        
        <div class="register-name"></div>
        <div class="register-value"></div>
    `;

    #value = 0;
    #digits = 2;

    constructor() {
        super();
        this.attachShadow({mode: "open"})
        this.shadowRoot.innerHTML = this.#template;
    }

    static get observedAttributes() {
        return ["name", "value", "digits"];
    }

    attributeChangedCallback(prop, old, newValue) {
        switch (prop) {
            case "name":
                this.shadowRoot.querySelector(".register-name").innerValue = newValue;
                break;
            case "digits":
                this.#digits = parseInt(newValue);
                break;
            case "value":
                this.#digits = parseInt(newValue);
                break;
        }
        if (prop === "digits" || prop === "value")
            this.shadowRoot.querySelector(".register-name").innerValue = hex(parseInt(this.#value), this.#digits);
    }
});