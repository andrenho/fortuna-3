/*
Attributes:
  - source: JSON describing the source code
      - array of records in the following format: { address, line, bytes }
  - breakpoints: list of breakpoints (by address)
  - current-pc: address of the current PC
  - files: a comma-separated list of files
  - selected-file: the currently selected file

Events:
  - file-changed: the user has selected a different file
  - breakpoint: the user has attempted to add/remove a breakpoint
 */

window.customElements.define("debug-assembly", class extends HTMLElement {

    #template = `
        <style>
            * { font-family: ShareTech, monospace; }
            
            .main {
                display: flex;
            }

            .files {
                display: flex;
                flex-direction: column;
                width: 120px;
            }

            .file {
                font-size: 14px;
                border: 1px black solid;
                border-right: 0;
                border-bottom: 0;
                padding: 2px 8px;
                cursor: pointer;
                box-shadow: 6px 6px 6px lightgray;
                background-color: white;
                height: 16px;
            }

            .file:last-child {
                border-bottom: 1px black solid;
            }

            .selected {
                background: aquamarine !important;
            }

            .code {
                border: 1px black solid;
                border-collapse: collapse;
                table-layout: fixed;
                min-height: 500px;
                box-shadow: 6px 6px 6px lightgray;
            }

            td {
                border: 0;
                padding-right: 8px;
                padding-left: 8px;
            }

            .breakpoint {
                width: 21px;
                padding: 0;
                border-right: 1px black solid;
                cursor: pointer;
                background-color: white;
            }

            .address {
                width: 35px;
                border-right: 1px black solid;
                font-weight: bold;
            }

            .line {
                width: 400px;
                overflow-x: hidden;
                white-space: nowrap;
            }

            .bytes {
                border-left: 1px black solid;
                width: 120px;
            }

            .comment {
                color: forestgreen;
            }

            .current {
                background-color: yellow;
            }

            .active {
                background-color: crimson !important;
            }

            .last-line {
                height: 100%;
            }
        </style>

        <div class="main">
            <div id="files" class="files"></div>
            <table class="code">
                <tbody id="code"></tbody>
            </table>
        </div>
    `;
    #lastLine = `
        <tr id="last-line">
            <td class="breakpoint last-line"></td>
            <td class="address last-line"></td>
            <td class="line last-line"></td>
            <td class="bytes last-line"></td>
        </tr>
    `;
    #currentPC;
    #breakpoints = [];

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = this.#template;
        this.shadowRoot.querySelector("#code").innerHTML = this.#lastLine;
    }

    static get observedAttributes() {
        return ["source", "breakpoints", "current-pc", "files", "selected-file"];
    }

    attributeChangedCallback(prop, old, newValue) {
        switch (prop) {
            case "files":
                this.#updateFiles(newValue.split(","));
                break;
            case "selected-file":
                this.#updateSelectedFile(newValue);
                break;
            case "source":
                this.#updateSource(JSON.parse(newValue));
                break;
            case "current-pc":
                this.#currentPC = parseInt(newValue);
                this.#updateCurrentPC();
                break;
            case "breakpoints":
                this.#breakpoints = newValue.split(",").map(v => parseInt(v));
                this.#updateBreakpoints();
                break;
        }
    }

    #updateFiles(files) {
        for (const file of files) {
            const div = document.createElement('div');
            div.className = "file";
            div.innerText = file;
            div.addEventListener("click", () => {
                this.dispatchEvent(new CustomEvent("file-changed", { detail: { file } }));
            });
            this.shadowRoot.querySelector("#files").appendChild(div);
        }
    }

    #updateSelectedFile(newValue) {
       this.shadowRoot.querySelectorAll(".file").forEach(element => {
           if (element.innerHTML === newValue)
               element.classList.add("selected");
           else
               element.classList.remove("selected");
       });
    }

    #updateSource(source) {
        // clean up code
        const codeElement = this.shadowRoot.querySelector("#code");
        codeElement.innerHTML = "";

        const parseLine = (line) => {
            line = line.replaceAll(" ", "&nbsp");
            line = line.replace(";", `<span class="comment">;`) + "</span>";
            line = line.replaceAll("&nbsp", "&nbsp;");
            return line;
        };

        // add rows  (TODO: add breakpoints (class active)/source (class current))
        for (const line of source) {
            const tr = document.createElement("tr");
            if (line.address !== undefined)
                tr.dataset.address = line.address;
            tr.innerHTML = `
                <td class="breakpoint"></td>
                <td class="address">${line.address !== undefined ? hex(line.address, 4) : ""}</td>
                <td class="line">${parseLine(line.line)}</td>
                <td class="bytes">${line.bytes !== undefined ? line.bytes.map(v => hex(v)).join(" ") : "" }</td>
            `;
            codeElement.appendChild(tr);
        }

        codeElement.innerHTML += this.#lastLine;

        this.#updateCurrentPC();
        this.#updateBreakpoints();
    }

    #updateCurrentPC() {
        if (this.#currentPC === undefined)
            return;
        for (const tr of this.shadowRoot.querySelector("#code").children) {
            if (tr.dataset.address === this.#currentPC.toString())
                tr.classList.add("current");
            else
                tr.classList.remove("current");
        }
    }

    #updateBreakpoints() {

    }
});
