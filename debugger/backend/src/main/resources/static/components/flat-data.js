/*

Attributes:
  - title: Title to be printed in the top left corner
  - current-page: The page currently showing
  - page-count: the maximum page number
  - rows: the number of rows to be displayed in each page
  - highlight-address: address to be highlighted on page
  - data: comma-separated list of values to show

Events:
  - page-change: whenever the user changes the page

Useful functions:
  - addressRange(): an object in format { addrStart, addrEnd } containing the starting and ending address in currently
                    selected page
  - page: currently selected page

Usage:

    <flat-data id="ram" title="Memory (RAM)" current-page="0" max-page="256" rows="16" highlight-address="2">
        <child-components></child-components>
    </flat-data>

    const ram = new Uint8Array(64 * 1024);
    window.crypto.getRandomValues(ram);

    const highlightAddr = 258;

    // on page change
    document.getElementById("ram").addEventListener("page-change", (e) => {
        const { addrStart, addrEnd, page } = e.detail;
        e.target.setAttribute("data", ram.slice(addrStart, addrEnd).toString());
        e.target.setAttribute("highlight-address", (highlightAddr > addrStart && highlightAddr <= addrEnd) ? highlightAddr % 256 : undefined);
    });

    // on data change
    const { addrStart, addrEnd } = document.getElementById("ram").addressRange();
    document.getElementById("ram").setAttribute("data", ram.slice(addrStart, addrEnd).toString());

 */

window.customElements.define("flat-data", class extends HTMLElement {

    #template = `
        <style>
            * { font-family: ShareTech, monospace; }

            .main {
                border: 1px solid black;
                padding: 16px;
                width: fit-content;
                box-shadow: 6px 6px 6px lightgray;
            }

            .title-row {
                display: flex;
                gap: 4px;
                align-items: baseline;
                margin-bottom: 24px;
            }

            .title {
                font-weight: bold;
                width: 200px;
            }

            .space-after {
                width: 22px;
                padding-right: 12px;
            }

            .address {
                font-weight: bold;
            }

            .data {
                text-align: center;
            }
            
            .zero {
                color: lightgray;
            }

            .error {
                background-color: lightcoral;
            }

            .highlighted {
                background-color: mediumspringgreen;
            }

            input { font-size: medium; }
            button { font-size: medium; }
            th {
                width: 21px;
                min-width: 21px;
                vertical-align: top;
            }
        </style>

        <div class="main">
            <div class="title-row">
                <div id="title" class="title">Title here</div>
                <label for="page">Page:</label>
                <button id="previous-page" title="Previous page">&lt;&lt;</button>
                <input id="page" type="text" size="8" value="0x0" style="text-align: right;">
                <button id="next-page" title="Next page">&gt;&gt;</button>
            </div>

            <table style="table-layout: fixed; border-collapse: collapse;">
                <thead>
                <tr>
                    <th style="width: 54px; min-width: 54px; height: 28px;"></th>
                    <th>_0</th><th>_1</th><th>_2</th><th>_3</th><th>_4</th><th>_5</th><th>_6</th><th class="space-after">_7</th>
                    <th>_8</th><th>_9</th><th>_a</th><th>_b</th><th>_c</th><th>_d</th><th>_e</th><th class="space-after">_f</th>
                    <th style="width: 150px; text-align: left;">ASCII</th>
                </tr>
                </thead>
                <tbody id="data-table"></tbody>
            </table>

            <slot></slot>
        </div>
    `;

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = this.#template;
    }

    connectedCallback() {
        this.shadowRoot.getElementById("previous-page").addEventListener("click", () => this.#stepPage(-1));
        this.shadowRoot.getElementById("next-page").addEventListener("click", () => this.#stepPage(+1));
        this.shadowRoot.getElementById("page").addEventListener("change", (e) => this.#changePageInputText(e.target.value));
    }

    static get observedAttributes() {
        return ["title", "page-count", "rows", "data", "current-page", "highlight-address"];
    }

    attributeChangedCallback(prop, old, newValue) {
        switch (prop) {
            case "title":
                this.shadowRoot.getElementById("title").innerText = newValue;
                break;
            case "rows":
                this.rows = parseInt(this.getAttribute("rows"));
                this.#buildTable();
                break;
            case "data":
                this.#updateData(newValue.split(",").map(v => parseInt(v)));
                break;
            case "current-page":
                const page = parseInt(newValue);
                const newPage = this.#adjustPage(page);
                if (page === newPage) {
                    this.shadowRoot.getElementById("page").value = hex(newPage, 0, true);
                    this.#updateCurrentPage(newPage);
                } else {
                    this.setAttribute("current-page", newPage);
                }
                break;
            case "highlight-address":
                const addr = parseInt(newValue);
                this.#setHighlight(isNaN(addr) ? -1 : addr);
                break;
        }
    }

    addressRange() {
        const currentPage = parseInt(this.getAttribute("current-page"));
        const pageCount = parseInt(this.getAttribute("page-count"));
        return { addrStart: (currentPage * pageCount * 16), addrEnd: ((currentPage + 1) * pageCount * 16) };
    }

    page() {
        return parseInt(this.getAttribute("current-page"));
    }

    #buildTable() {
        const tbody = [];
        for (let row = 0; row < this.rows; ++row) {
            tbody.push(`<tr><td class="address" id="address_${row}">0000</td>`);
            for (let column = 0; column < 16; ++column)
                tbody.push(`<td class="data ${(column === 7 || column === 15) ? "space-after" : ""}" id="data_${row}_${column}"></td>`);
            tbody.push(`<td class="data" id="ascii_${row}"></td></tr>`);
        }
        this.shadowRoot.getElementById("data-table").innerHTML = tbody.join("");
    }

    #updateData(data) {
        const currentPage = parseInt(this.getAttribute("current-page"));
        for (let row = 0; row < this.rows; ++row) {
            let addr = (currentPage * this.rows * 16) + (row * 16);
            this.shadowRoot.getElementById(`address_${row}`).innerText = hex(addr, 4);
            let ascii = [];
            for (let column = 0; column < 16; ++column) {
                let i = (row * 16) + column;
                const element = this.shadowRoot.getElementById(`data_${row}_${column}`);
                if (data.length >= i) {
                    element.innerText = hex(data[i]);
                    if (this.highlightAddress === (addr + column))
                        element.classList.add("highlighted");
                    else
                        element.classList.remove("highlighted");
                    if (data[i] === 0)
                        element.classList.add("zero");
                    else
                        element.classList.remove("zero");
                    ascii.push((data[i] < 32 || data[i] > 126) ? "." : String.fromCharCode(data[i]));
                }
            }
            this.shadowRoot.getElementById(`ascii_${row}`).innerText = ascii.join("");
        }
    }

    #updateCurrentPage() {
        const currentPage = parseInt(this.getAttribute("current-page"));

        this.dispatchEvent(new CustomEvent("page-change", { detail : {
            addrStart: currentPage * this.rows * 16,
            addrEnd: (currentPage + 1) * this.rows * 16,
            page: currentPage,
        }}))
    }

    #stepPage(diff) {
        const currentPage = parseInt(this.getAttribute("current-page"));
        this.setAttribute("current-page", currentPage + diff);
    }

    #adjustPage(page) {
        const pageCount = parseInt(this.getAttribute("page-count"));
        if (page < 0)
            page = pageCount - 1;
        else if (page >= pageCount)
            page = 0;
        return page;
    }

    #setHighlight(addr) {
        for (let row = 0; row < this.rows; ++row) {
            for (let column = 0; column < 16; ++column) {
                let i = (row * 16) + column;
                const element = this.shadowRoot.getElementById(`data_${row}_${column}`);
                if (i === addr)
                    element.classList.add("highlighted");
                else
                    element.classList.remove("highlighted");
            }
        }
    }

    #changePageInputText(pageStr) {
        const newPage = parseInt(pageStr, 16);
        this.setAttribute("current-page",
            isNaN(newPage) ? this.getAttribute("current-page") : newPage);
    }

});