const $ = (id) => document.querySelector(id);

//
// ERROR
//

function showError(err) {
    if (err.name === "Error")
        $("#error").innerText = err.message;
    else
        $("#error").innerText = err;
    console.error(err);
}

//
// BACKEND
//

async function backendFetch(input, init, doWithResult) {
    if (doWithResult === undefined)
        doWithResult = init;
    try {
        const r = await fetch(`${window.location.origin}${input}`, init);
        const result = await r.json();
        if (r.ok) {
            doWithResult(result);
        } else {
            showError(`${result.status} -- ${result.error}`);
        }
    } catch (e) {
        showError(await r.text());
    }
}

//
// TAB
//

function initializeTabs() {
    $("#tab-selector").addEventListener("index-change", (e) => {
        $("#debugger").style.display = (e.detail === 0) ? "flex" : "none";
        $("#sd-card").style.display = (e.detail === 1) ? "flex" : "none";
        $("#documentation").style.display = (e.detail === 2) ? "flex" : "none";
    });
}

//
// SDCARD
//

async function initializeSdCard() {
    const sdCardElement = $("#sdcard");
    const promises = [];

    // initialize SD Card as all zeroes as we wait for the backend
    sdCardElement.setAttribute("data", new Uint8Array(32 * 16).toString());

    // load number of pages
    promises.push(backendFetch("/api/sdcard/0", (sd) => sdCardElement.setAttribute("page-count", sd.sizeInBlocks)));

    // load first block
    const loadSdCardBlock = async (blockNumber) => {
        await backendFetch(`/api/sdcard/0/${blockNumber}`, (block) => {
            $("#sdcard").setAttribute("data", Uint8Array.from(atob(block.bytes), c => c.charCodeAt(0)).toString())
        });
    };
    promises.push(loadSdCardBlock(0));

    // on SDCard page change
    sdCardElement.addEventListener("page-change", (e) => loadSdCardBlock(e.detail.page));

    return Promise.all(promises);
}

//
// INITIALIZATION
//

window.addEventListener("load", async () => {

    initializeTabs();
    const sdCardPromise = initializeSdCard();

    const emulator = await $("#emulator").initialize({
        wasmPath: "emulator",
        sdCardSizeInMb: 16,
        sdDiskStatus: () => { console.log("XXXX"); return "ok" },
        sdCardReadCallback: (sector, count) => { console.log(`R: ${sector}/${count}`); return new Uint8Array(256); },
        sdCardWriteCallback: (sector, count, data) => { console.log(`W: ${sector}/${count}`); console.log(data); },
    });
    console.log(emulator.debuggerInfo(0));

    // ...

    await sdCardPromise;
    console.log("Debugger initialized.");
});