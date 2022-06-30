import {FortunaModule} from "./fortuna3-emulator";

type pointer = number;

export interface FortunaApi {
    initialize: (sdCardSizeInMB: number) => boolean,
    getState: (ramPage: number, sdPage: number, data: pointer) => void;
    compressSDCard: (data: pointer, maxSize: number) => number;
    step : () => void;
    addBreakpoint: (addr: number) => void,
    removeBreakpoint: (addr: number) => void,
    setRam: (addr: number, data: number) => void,
}

export function loadApiFunctions(module: FortunaModule) : FortunaApi {
    return {
        initialize: module.cwrap("initialize", "boolean", ["number"]),
        getState: module.cwrap("get_state", null, ["number", "number", "number"]),
        compressSDCard: module.cwrap("compress_sdcard", "number", ["number", "number"]),
        step: module.cwrap("step", null, []),
        addBreakpoint: module.cwrap("add_breakpoint", null, ["number"]),
        removeBreakpoint: module.cwrap("remove_breakpoint", null, ["number"]),
        setRam: module.cwrap("set_ram", null, ["number", "number"]),
    };
}