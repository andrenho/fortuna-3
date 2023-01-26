export default interface LocalOptions {
    showBytes: boolean,
}

export function localOptionsLoadFromLocalStorage() : LocalOptions {
    const optionsJson = window.localStorage.getItem("localOptions");
    if (optionsJson === null) {
        return {
            showBytes: true,
        };
    } else {
        return JSON.parse(optionsJson);
    }
}

export function localOptionsSaveToLocalStorage(options: LocalOptions) {
    window.localStorage.setItem("localOptions", JSON.stringify(options));
}
