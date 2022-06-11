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
    $("#stack").setAttribute("data", toWords(state.stack).toString());

    const registers = $("#registers");
    registers.setValue("AF", state.cpu.af);
    registers.setValue("BC", state.cpu.bc);
    registers.setValue("DE", state.cpu.de);
    registers.setValue("HL", state.cpu.hl);
    registers.setValue("SP", state.cpu.sp);
    registers.setValue("PC", state.cpu.pc);
    registers.setValue("AF'", state.cpu.afx);
    registers.setValue("BC'", state.cpu.bcx);
    registers.setValue("DE'", state.cpu.dex);
    registers.setValue("HL'", state.cpu.hlx);
    registers.setValue("IX", state.cpu.ix);
    registers.setValue("IY", state.cpu.iy);
    registers.setValue("I", state.cpu.i);
    registers.setValue("C", state.cpu.c);
    registers.setValue("N", state.cpu.n);
    registers.setValue("P/V", state.cpu.pv);
    registers.setValue("H", state.cpu.h);
    registers.setValue("Z", state.cpu.z);
    registers.setValue("S", state.cpu.s);
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