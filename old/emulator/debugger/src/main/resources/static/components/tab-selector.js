/*

Attributes:
  - tabs: a comma-separated list of tags. Each tag will be both the title.
  - selected: the current selected index

Events:
  - index-change: when the index is changed

Usage:
    <tab-selector tabs="Debugger,SD Card,Documentation" selected="0" id="tab-selector"></tab-selector>

    document.getElementById("tab-selector").addEventListener("index-change", (e) => {
        document.getElementById("my-element").style.visibility = (e.detail === 0) ? "visible" : "hidden";
    });
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
                font-weight: bold;
                box-shadow: 6px 6px 6px lightgray;
            }

            .tab-middle {
                border-bottom: 1px black solid;
                width: 24px;
            }

            .tab-selected {
                background: white;
                border-bottom: 0;
            }
            
            .white-box {
                background: white;
                position: relative;
                height: 10px;
                z-index: 1;
            }
        </style>
        
        <div class="tabs" id="tabs"></div>
        <div class="white-box"></div>
        <slot></slot>
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
            this.dispatchEvent(new CustomEvent("index-change", { detail: this.#selected }));
        }
    }

    #update() {
        const createTab = className => {
            const div = document.createElement("div");
            div.className = className;
            return div;
        };

        const tabElements = [createTab("tab-start")];

        for (let i = 0; i < this.#tabNames.length; ++i) {
            const tab = createTab("tab");
            if (i === this.#selected) {
                tab.classList.add("tab-selected");
            }
            tab.innerText = this.#tabNames[i];
            tab.addEventListener("click", () => {
                this.setAttribute("selected", i.toString());
            });
            tabElements.push(tab);

            tabElements.push(createTab("tab-middle"));
        }
        tabElements.push(createTab("tab-end"));

        this.shadowRoot.querySelector("#tabs").replaceChildren(...tabElements);
    }
});