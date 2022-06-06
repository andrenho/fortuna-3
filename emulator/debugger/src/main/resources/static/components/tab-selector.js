/*

Attributes:
  - tabs: a comma-separated list of tags. Each tag will be both the title, and the ID of the element
          that should appear when the tab is selected.

 */

window.customElements.define("tab-selector", class extends HTMLElement {

    #template = `
        <h1>tab-selector</h1>
        <slot></slot>
    `;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = this.#template;
    }

    static get observedAttributes() {
    }

    attributeChangedCallback(prop, old, newValue) {
    }
});