import {FortunaModule} from "./fortuna3-emulator";

type pointer = number;

export enum FinishReason {
    Normal = 0,
    Breakpoint = 1,
}

export interface FortunaApi {
    initialize: (sdCardSizeInMB: number) => boolean,
    getState: (ramPage: number, sdPage: number, eepromPage: number, data: pointer) => void;
    compressSDCard: (data: pointer, maxSize: number) => number;
    step : () => number;
    stepCycles: (milliseconds: number) => FinishReason;
    addBreakpoint: (addr: number) => void;
    removeBreakpoint: (addr: number) => void;
    getRam: (addr: number) => number;
    setRam: (addr: number, data: number) => void;
    unloadPrintedChars: (data: pointer, maxSize: number) => number;
    keypress: (chr: number) => void;
    maxPrintedChars: () => number;
    fsDir: (dir: string, numRecords: number, buf: number) => number;
    fsFilePage: (dir: string, filename: string, page: number, buf: number) => number;
    fsCreateFile: (filename: string, buf: Uint8Array, sz: number) => number;
}

export function loadApiFunctions(module: FortunaModule) : FortunaApi {
    return {
        initialize: module.cwrap("emulator_initialize", "boolean", ["number"]),
        getState: module.cwrap("get_state", null, ["number", "number", "number", "number"]),
        compressSDCard: module.cwrap("compress_sdcard", "number", ["number", "number"]),
        step: module.cwrap("emulator_step", "number", []),
        stepCycles: module.cwrap("emulator_step_cycles", "number", ["number"]),
        addBreakpoint: module.cwrap("bkp_add", null, ["number"]),
        removeBreakpoint: module.cwrap("bkp_del", null, ["number"]),
        getRam: module.cwrap("ram_get_byte", "number", ["number"]),
        setRam: module.cwrap("ram_set_byte", null, ["number", "number"]),
        unloadPrintedChars: module.cwrap("terminal_unload_printed_chars", "number", ["number", "number"]),
        keypress: module.cwrap("emulator_keypress", null, ["number"]),
        maxPrintedChars: module.cwrap("max_printed_chars", "number", []),
        fsDir: module.cwrap("fs_dir", "number", ["string", "number", "number"]),
        fsFilePage: module.cwrap("fs_file_page", "number", ["string", "string", "number", "number"]),
        fsCreateFile: module.cwrap("fs_create_file", "number", ["string", "array", "number"]),
    };
}