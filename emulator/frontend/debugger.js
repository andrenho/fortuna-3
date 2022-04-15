$ = (name) => document.getElementById(name)
$$ = (name) => document.getElementsByClassName(name)

//
// TABS
//

function tab_initialize() {
    tab_select("tab-emulator")
    Array.from($$("tab")).forEach(tab => tab.addEventListener("click", (e) => tab_select(e.currentTarget.id)));
}

function tab_select(tab) {
    Array.from($$("tab")).forEach(tab => tab.classList.remove("tab-selected"))
    $(tab).classList.toggle("tab-selected")
}

//
// INITIALIZATION
//

window.onload = () => {
    tab_initialize()
}