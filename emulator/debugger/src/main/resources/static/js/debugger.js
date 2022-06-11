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
// DEBUGGER STATE
//

function updateDebuggerState(state)
{
    const ram = $("#ram");
    const { addrStart, addrEnd } = ram.addressRange();
    ram.setAttribute("data", state.ramPage.toString());
    ram.setAttribute("highlight-address", (state.cpu.pc >= addrStart && state.cpu.pc < addrEnd) ? state.cpu.pc % 256 : undefined);
    console.log(state.stack);
    $("#stack").setAttribute("data", toWords(state.stack).toString());
}

//
// INITIALIZATION
//

window.addEventListener("load", async () => {

    const ramElement = $("#ram");

    const emulator = await initializeFortunaEmulator($("#video"), "emulator");
    const getState = () => emulator.state(ramElement.page());

    ramElement.addEventListener("page-change", (e) => updateDebuggerState(getState()));

    updateDebuggerState(getState());

    console.log("Debugger initialized.");
});