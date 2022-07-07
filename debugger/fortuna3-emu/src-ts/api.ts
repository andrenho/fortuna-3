import {FortunaModule} from "./fortuna3-emulator";

type pointer = number;

export enum FinishReason {
    Normal = 0,
    Breakpoint = 1,
}

export interface FortunaApi {
    initialize: (sdCardSizeInMB: number) => boolean,
    getState: (ramPage: number, sdPage: number, data: pointer) => void;
    compressSDCard: (data: pointer, maxSize: number) => number;
    step : () => void;
    stepScreen: (speedInMhz: number) => FinishReason;
    addBreakpoint: (addr: number) => void;
    removeBreakpoint: (addr: number) => void;
    setRam: (addr: number, data: number) => void;
    unloadPrintedChars: (data: pointer, maxSize: number) => number;
    maxPrintedChars: () => number;
}

export function loadApiFunctions(module: FortunaModule) : FortunaApi {
    return {
        initialize: module.cwrap("initialize", "boolean", ["number"]),
        getState: module.cwrap("get_state", null, ["number", "number", "number"]),
        compressSDCard: module.cwrap("compress_sdcard", "number", ["number", "number"]),
        step: module.cwrap("step", null, []),
        stepScreen: module.cwrap("step_screen", "number", ["number"]),
        addBreakpoint: module.cwrap("bkp_add", null, ["number"]),
        removeBreakpoint: module.cwrap("bkp_del", null, ["number"]),
        setRam: module.cwrap("ram_set", null, ["number", "number"]),
        unloadPrintedChars: module.cwrap("uart_unload_printed_chars", "number", ["number", "number"]),
        maxPrintedChars: module.cwrap("max_printed_chars", "number", []),
    };
}