export default interface Options {
    collapseMacros?: boolean;
}

export function optionsLoadFromLocal() : Options {
    const optionsJson = window.localStorage.getItem("options");
    if (optionsJson === null) {
        return {
            collapseMacros: false,
        };
    } else {
        return JSON.parse(optionsJson);
    }
}

export function optionsSaveToLocal(options: Options) {
    window.localStorage.setItem("options", JSON.stringify(options));
}
