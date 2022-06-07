const $ = (id) => document.querySelector(id);

window.addEventListener("load", () => {

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

});