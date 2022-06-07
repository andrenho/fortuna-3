const $ = (id) => document.querySelector(id);

window.addEventListener("load", async () => {

    //
    // TAB MANAGEMENT
    //

    $("#tab-selector").addEventListener("index-change", (e) => {
        $("#debugger").style.display = (e.detail === 0) ? "flex" : "none";
        $("#sd-card").style.display = (e.detail === 1) ? "flex" : "none";
        $("#documentation").style.display = (e.detail === 2) ? "flex" : "none";
    });

    //
    // SD CARD MANAGEMENT
    //

    // initialize SD Card as all zeroes as we wait for the backend
    $("#sdcard").setAttribute("data", new Uint8Array(32 * 16).toString());

    // load number of pages
    (async () => {
        const r = await fetch(`${window.location.origin}/api/sdcard/0`);
        if (r.ok) {
            const sd = await r.json();
            $("#sdcard").setAttribute("page-count", sd.sizeInBlocks);
        }
    })();

    // load first block
    const loadSdCardBlock = async (blockNumber) => {
        const r = await fetch(`${window.location.origin}/api/sdcard/0/${blockNumber}`);
        if (r.ok) {
            const block = await r.json();
            $("#sdcard").setAttribute("data", Uint8Array.from(atob(block.bytes), c => c.charCodeAt(0)).toString());
        }
    };
    loadSdCardBlock(0);

    // on SDCard page change
    $("#sdcard").addEventListener("page-change", (e) => loadSdCardBlock(e.detail.page));

});