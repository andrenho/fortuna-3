import {FortunaModule} from "./fortuna3-emulator";

type pointer = number;

export interface FortunaApi {
    initialize: (sdCardSizeInMB: number) => boolean,
    getState: (ramPage: number, sdPage: number, data: pointer) => void;
    compressedSDCardMaxSize: () => number;
    compressSDCard: (data: pointer, maxSize: number) => number;
}

export function loadApiFunctions(module: FortunaModule) : FortunaApi {
    return {
        initialize: module.cwrap("initialize", "boolean", ["number"]),
        getState: module.cwrap("get_state", null, ["number", "number", "number"]),
        compressedSDCardMaxSize: module.cwrap("compressed_sdcard_max_size", "number", []),
        compressSDCard: module.cwrap("compress_sdcard", "number", ["number", "number"]),
    };
}