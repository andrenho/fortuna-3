window.customElements.define("register-box", class extends HTMLElement {

    #template = `
        <style id="style">
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
            
            .container {
                display: grid;
                /* grid-template-columns: auto auto; */
                justify-content: start;
                column-gap: 6px;
                row-gap: 6px;
            }
        </style>
        
        <div class="main">
            <div id="title" class="title">Title here</div>
            <slot id="slot" class="container"></slot>
        </div>
    `;

    #columns = 0;
    #rows = 0;

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = this.#template;
    }

    static get observedAttributes() {
        return ["title", "columns", "rows"];
    }

    attributeChangedCallback(prop, old, newValue) {
        switch (prop) {
            case "title":
                this.shadowRoot.getElementById("title").innerText = newValue;
                break;
            case "columns":
                this.#columns = parseInt(newValue);
                this.#updateGrid();
                break;
            case "rows":
                this.#rows = parseInt(newValue);
                this.#updateGrid();
                break;
        }
    }

    #updateGrid() {
        const slot = this.shadowRoot.getElementById("slot");
        slot.style.gridTemplateColumns = "auto ".repeat(this.#columns);
        slot.style.gridTemplateRows = "auto ".repeat(this.#rows + 1);
        slot.style.gridTemplateAreas = (`"${". ".repeat(this.#columns)}" `).repeat(this.#rows) + `"${"flags ".repeat(this.#columns)}"`;
    }
});


window.customElements.define("register-value", class extends HTMLElement {

    #template = `
        <style>
            * { font-family: ShareTech, monospace; }
            
            .register-name {
                font-weight: bold;
                font-size: 11px;
            }
            
            .register-value {
                border: 1px black solid;
                padding: 2px;
            }
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
                this.shadowRoot.querySelector(".register-name").innerHTML = newValue;
                break;
            case "digits":
                this.#digits = parseInt(newValue);
                break;
            case "value":
                this.#value = parseInt(newValue);
                break;
        }
        if (prop === "digits" || prop === "value")
            this.shadowRoot.querySelector(".register-value").innerHTML = hex(parseInt(this.#value), this.#digits);
    }
});