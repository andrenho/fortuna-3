$ = (name) => document.getElementById(name)
$$ = (name) => Array.from(document.getElementsByClassName(name))

//
// TABS
//

function tab_initialize() {
    tab_select("tab-emulator")
    $$("tab").forEach(tab => tab.addEventListener("click", (e) => tab_select(e.currentTarget.id)));
}

function tab_select(tab) {
    $$("tab").forEach(tab => tab.classList.remove("tab-selected"))
    $(tab).classList.toggle("tab-selected")
    $$("panel").forEach(panel => {
        if (panel.classList.contains(`panel-${tab}`))
            panel.style.display = 'block';
        else
            panel.style.display = 'none';
    });
}

//
// INITIALIZATION
//

window.onload = () => {
    tab_initialize()
}