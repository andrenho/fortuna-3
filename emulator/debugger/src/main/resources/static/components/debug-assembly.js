/*
Attributes:
  - source: JSON describing the source code
      - array of records in the following format: { address, line, bytes }
  - breakpoints: list of breakpoints (by address)
  - current-pc: address of the current PC
  - files: a comma-separated list of files
  - selected-file: the currently selected file

Events:
  - file-change: the user has selected a different file
  - breakpoint-click: the user has attempted to add/remove a breakpoint

Usage:
    <debug-assembly id="debug"></debug-assembly>

    const files = {
        "main.s": [
            { line: "; hello" },
            { address: 0, line: "   nop  ; do nothing", bytes: [0x0] },
        ],
        "hello.s": [
            { address: 1, line: "   nop  ; do nothing", bytes: [0x0] },
        ]
    };
    const breakpoints = new Set();

    const debug = document.querySelector("#debug");
    debug.setAttribute("source", JSON.stringify(files["main.s"]));
    debug.setAttribute("current-pc", "0");
    debug.setAttribute("files", Object.keys(files).join(","));
    debug.setAttribute("selected-file", "main.s");

    debug.addEventListener("file-change", e => {
        debug.setAttribute("selected-file", e.detail.file);
        debug.setAttribute("source", JSON.stringify(files[e.detail.file]));
    });

    debug.addEventListener("breakpoint-click", e => {
        if (breakpoints.has(e.detail.address))
            breakpoints.delete(e.detail.address);
        else
            breakpoints.add(e.detail.address);
        if (breakpoints.size > 0)
            debug.setAttribute("breakpoints", Array.from(breakpoints).join(","));
        else
            debug.removeAttribute("breakpoints");
    });
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
        <td class="breakpoint last-line"></td>
        <td class="address last-line"></td>
        <td class="line last-line"></td>
        <td class="bytes last-line"></td>
    `;
    #currentPC;
    #breakpoints = new Set();

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = this.#template;
        this.shadowRoot.querySelector("#code").innerHTML = `<tr>${this.#lastLine}</tr>`;
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
                if (newValue !== "" && newValue !== undefined && newValue !== null)
                    this.#breakpoints = new Set(newValue.split(",").map(v => parseInt(v)));
                else
                    this.#breakpoints = new Set();
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
                this.dispatchEvent(new CustomEvent("file-change", { detail: { file } }));
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
            tr.innerHTML = `
                <td class="breakpoint">&nbsp;</td>
                <td class="address">${line.address !== undefined ? hex(line.address, 4) : ""}</td>
                <td class="line">${parseLine(line.line)}</td>
                <td class="bytes">${line.bytes !== undefined ? line.bytes.map(v => hex(v)).join(" ") : "" }</td>
            `;
            codeElement.appendChild(tr);

            if (line.address !== undefined) {
                tr.dataset.address = line.address;
                tr.querySelector(".breakpoint").addEventListener("click", e => {
                    this.dispatchEvent(new CustomEvent("breakpoint-click", { detail: { address: line.address } }));
                });
            }
        }

        const lastLine = document.createElement("tr");
        lastLine.innerHTML = this.#lastLine;
        codeElement.appendChild(lastLine);

        this.#updateCurrentPC();
        this.#updateBreakpoints();
    }

    #updateCurrentPC() {
        if (this.#currentPC === undefined || this.#currentPC === null)
            return;
        for (const tr of this.shadowRoot.querySelector("#code").children) {
            if (tr.dataset.address === this.#currentPC.toString())
                tr.classList.add("current");
            else
                tr.classList.remove("current");
        }
    }

    #updateBreakpoints() {
        for (const tr of this.shadowRoot.querySelector("#code").children) {
            const td = tr.querySelector(".breakpoint")
            if (this.#breakpoints.has(parseInt(tr.dataset.address))) {
                td.classList.add("active");
            } else {
                td.classList.remove("active");
            }
        }
    }
});
