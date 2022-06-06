/*

Attributes:
  - tabs: a comma-separated list of tags. Each tag will be both the title, and the ID of the element
          that should appear when the tab is selected.
  - selected: the current selected index

 */

window.customElements.define("tab-selector", class extends HTMLElement {

    #template = `
        <style>
            * { font-family: ShareTech, monospace; }
            
            .tabs {
                display: flex;
                flex-direction: row;
                white-space: nowrap;
            }

            .tab-start {
                border-bottom: 1px black solid;
                width: 24px;
            }

            .tab-end {
                border-bottom: 1px black solid;
                width: 100%;
            }
            
            .tab {
                border: 1px black solid;
                padding: 6px 14px;
                cursor: pointer;
                background-color: lightgray;
            }

            .tab-middle {
                border-bottom: 1px black solid;
                width: 12px;
            }

            .tab-selected {
                background: white;
                border-bottom: 0;
            }
        </style>
        
        <div class="tabs" id="tabs">
            <div class="tab-start"></div>
            <div class="tab-end" id="tab-end"></div>
        </div>
    `;

    #tabNames = [];
    #selected = 0;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = this.#template;
    }

    static get observedAttributes() {
        return ["tabs", "selected"];
    }

    attributeChangedCallback(prop, old, newValue) {
        if (prop === "tabs") {
            this.#tabNames = newValue.split(",");
            this.#update();
        } else if (prop === "selected") {
            this.#selected = parseInt(newValue);
            this.#update();
        }
    }

    #update() {
        const tabs = this.shadowRoot.querySelector("#tabs");
        const tabEnd = this.shadowRoot.querySelector("#tab-end");

        const tabMiddle = document.createElement("div");
        tabMiddle.className = "tab-middle";

        tabs.innerHTML = "";
        for (let i = 0; i < this.#tabNames.length; ++i) {
            const tab = document.createElement("div");
            tab.className = "tab";
            if (i === this.#selected)
                tab.classList.add("tab-selected");
            tab.innerText = this.#tabNames[i];
            tabs.insertBefore(tab, tabEnd);
            tabs.insertBefore(tabMiddle.cloneNode(), tabEnd);
        }
    }
});