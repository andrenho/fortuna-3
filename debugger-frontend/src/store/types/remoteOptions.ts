export default interface RemoteOptions {
    collapseMacros?: boolean;
}

export function remoteOptionsLoadFromLocalStorage() : RemoteOptions {
    const optionsJson = window.localStorage.getItem("remoteOptions");
    if (optionsJson === null) {
        return {
            collapseMacros: false,
        };
    } else {
        return JSON.parse(optionsJson);
    }
}

export function remoteOptionsSaveToLocalStorage(options: RemoteOptions) {
    window.localStorage.setItem("remoteOptions", JSON.stringify(options));
}
