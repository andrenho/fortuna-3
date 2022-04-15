$ = (name) => document.getElementById(name)

//
// TABS
//

function tab_select(tab) {
    $(tab).className = `tab tab-selected`
}

//
// INITIALIZATION
//

window.onload = () => {
    tab_select("tab-emulator")
}