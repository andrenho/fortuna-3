/*
Usage:
    <register-box id="registers" title="Z80" columns="2" rows="1">
        <register-value name="AF" value="0" digits="4"></register-value>
        <register-value name="BC" value="0" digits="4"></register-value>

        <div style="grid-area: flags;">
            <flag-value name="S" value="1"></flag-value>
            <flag-value name="Z" value="0"></flag-value>
        </div>
    </register-box>

    document.querySelector("#registers").setValue("AF", 0x12f4);
    document.querySelector("#registers").setValue("S", true);
 */

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

    setValue(item, value) {
        for (const reg of this.querySelectorAll("register-value, flag-value")) {
            if (reg.getAttribute("name") === item) {
                reg.setAttribute("value", value.toString());
                return;
            }
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


window.customElements.define("flag-value", class extends HTMLElement {

    #template = `<label><input type="checkbox" onclick="return false;"><span id="name"></span></label>`;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = this.#template;
    }

    static get observedAttributes() {
        return ["name", "value"];
    }

    attributeChangedCallback(prop, old, newValue) {
        switch (prop) {
            case "name":
                this.shadowRoot.querySelector("#name").innerText = newValue;
                break;
            case "value":
                this.shadowRoot.querySelector("input").checked = Boolean(parseInt(newValue));
                break;
        }
    }

});
