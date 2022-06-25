import {FortunaModule} from "./fortuna3-emulator";

type pointer = number;

export interface FortunaApi {
    initialize: (sdCardSizeInMB: number) => boolean,
    getState: (ramPage: number, sdPage: number, data: pointer) => void;
}

export function loadApiFunctions(module: FortunaModule) : FortunaApi {
    return {
        initialize: module.cwrap("initialize", "boolean", ["number"]),
        getState: module.cwrap("get_state", null, ["number", "number", "number"]),
    };
}