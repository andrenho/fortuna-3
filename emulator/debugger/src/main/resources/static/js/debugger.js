const $ = (id) => document.querySelector(id);

window.addEventListener("load", async () => {

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

    $("#tab-selector").addEventListener("index-change", (e) => {
        $("#debugger").style.display = (e.detail === 0) ? "flex" : "none";
        $("#sd-card").style.display = (e.detail === 1) ? "flex" : "none";
        $("#documentation").style.display = (e.detail === 2) ? "flex" : "none";
    });

    //
    // SD CARD
    //

    // initialize SD Card as all zeroes as we wait for the backend
    $("#sdcard").setAttribute("data", new Uint8Array(32 * 16).toString());

    // load number of pages
    backendFetch("/api/sdcard/0", (sd) => $("#sdcard").setAttribute("page-count", sd.sizeInBlocks));

    // load first block
    const loadSdCardBlock = async (blockNumber) => {
        await backendFetch(`/api/sdcard/0/${blockNumber}`, (block) => {
            $("#sdcard").setAttribute("data", Uint8Array.from(atob(block.bytes), c => c.charCodeAt(0)).toString())
        });
    };
    loadSdCardBlock(0);

    // on SDCard page change
    $("#sdcard").addEventListener("page-change", (e) => loadSdCardBlock(e.detail.page));

});