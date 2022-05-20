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
            }

            .file:last-child {
                border-bottom: 1px black solid;
            }

            .selected {
                background: aquamarine;
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
            <div class="files">
                <div class="file">main.s</div>
                <div class="file selected">temp_file.s</div>
            </div>
            <table class="code">
                <tr>
                    <td class="breakpoint active"></td>
                    <td class="address">0000</td>
                    <td class="line">hello <span class="comment">; this is a comment</span></td>
                    <td class="bytes">FA 44 38</td>
                </tr>
                <tr>
                    <td class="breakpoint current"></td>
                    <td class="address current">0000</td>
                    <td class="line current">&nbsp;&nbsp;&nbsp;&nbsp;nop</td>
                    <td class="bytes current">FA 44 38</td>
                </tr>
                <tr>
                    <td class="breakpoint last-line"></td>
                    <td class="address last-line"></td>
                    <td class="line last-line"></td>
                    <td class="bytes last-line"></td>
                </tr>
            </table>
        </div>
    `;
    #debugCode;

    constructor() {
        super();
        this.attachShadow({ mode: "open" })
        this.shadowRoot.innerHTML = this.#template;
    }

    setDebugCode(debugCode) {
        this.#debugCode = debugCode;
    }

});
