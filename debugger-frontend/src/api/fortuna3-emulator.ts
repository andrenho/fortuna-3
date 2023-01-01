import {FinishReason, FortunaApi, loadApiFunctions} from "./api";

export interface FortunaModule extends EmscriptenModule {
    cwrap: typeof cwrap;
}
declare const Module : FortunaModule;

export interface Z80State {
    af: number,
    bc: number,
    de: number,
    hl: number,
    ix: number,
    iy: number,
    pc: number,
    sp: number,
    afx: number,
    bcx: number,
    dex: number,
    hlx: number,
    i: number,
    c: boolean,
    n: boolean,
    pv: boolean,
    h: boolean,
    z: boolean,
    s: boolean,
}

export interface ComputeUnit {
    p: number,
    q: number,
    r: number,
}

export interface RTCState {
    year: number,
    month: number,
    day: number,
    hours: number,
    minutes: number,
    seconds: number,
}

export interface EmulatorState {
    cpu: Z80State,
    breakpoints: number[],
    ramBank: number,
    ramPage: Uint8Array,
    stack: Uint8Array,
    sdCardPage: Uint8Array,
    eepromPage: Uint8Array,
    computeUnit: ComputeUnit,
    lcd: string[],
    rtc: RTCState,
    lastError: string | undefined,
}

export enum FileType { File, Directory }

export type FilesystemFile = {
    filename: string,
    fileType: FileType,
    size?: number,
}


export class Fortuna3Emulator {

    private api? : FortunaApi;
    private textDecoder = new TextDecoder();

    private constructor(private sdCardImageSizeMB : number) {}

    static async initialize(wasmFilePath: string) : Promise<Fortuna3Emulator> {
        const emulator = new Fortuna3Emulator(4);

        await this.loadWasmModule(wasmFilePath);
        emulator.api = loadApiFunctions(Module);

        emulator.api.initialize(emulator.sdCardImageSizeMB);

        return emulator;
    }

    step() : void {
        this.api!.step();
    }

    stepTime(time: DOMHighResTimeStamp) : FinishReason {
        return this.api!.stepCycles(time);
    }

    stepOneScreenful() : FinishReason {
        return this.api!.stepCycles(16);
    }

    reset(sdCardSizeInMB: number) : void {
        this.sdCardImageSizeMB = sdCardSizeInMB;
        this.api!.initialize(sdCardSizeInMB);
    }

    getState(ramPage: number, sdCardPage: number, eepromPage: number) : EmulatorState {

        const bufferSize = 0x726;

        const buf = Module._malloc(bufferSize);
        this.api!.getState(ramPage, sdCardPage, eepromPage, buf);
        const state = new Uint8Array(Module.HEAP8.buffer, buf, bufferSize).slice();

        let error : string | undefined = this.textDecoder.decode(state.slice(0x400, 0x600));
        error = error.replace(/\0.*$/g, '');  // remove nulls
        if (error === "")
            error = undefined;

        const pair = (n: number) : number => state[n] + (state[n+1] << 8);
        const quad = (n: number) : number => state[n] + (state[n+1] << 8) + (state[n+2] << 16) + (state[n+3] << 24);

        const result : EmulatorState = {
            cpu: {
                af: pair(0x0),
                bc: pair(0x2),
                de: pair(0x4),
                hl: pair(0x6),
                ix: pair(0x8),
                iy: pair(0xa),
                pc: pair(0xc),
                sp: pair(0xe),
                afx: pair(0x10),
                bcx: pair(0x12),
                dex: pair(0x14),
                hlx: pair(0x16),
                i: state[0x18],
                c: !!(state[0] & 1),
                n: !!((state[0] >> 1) & 1),
                pv: !!((state[0] >> 2) & 1),
                h: !!((state[0] >> 4) & 1),
                z: !!((state[0] >> 6) & 1),
                s: !!((state[0] >> 7) & 1),
            },
            computeUnit: {
                p: quad(0x1a),
                q: quad(0x1e),
                r: quad(0x22),
            },
            breakpoints: [],
            ramBank: state[0xe4],
            stack: state.slice(0xe8, 0x100),
            ramPage: state.slice(0x100, 0x200),
            sdCardPage: state.slice(0x200, 0x400),
            eepromPage: state.slice(0x600, 0x700),
            lcd: [
                this.textDecoder.decode(state.slice(0x700, 0x710)),
                this.textDecoder.decode(state.slice(0x710, 0x720)),
            ],
            rtc: {
                year: state[0x720],
                month: state[0x721],
                day: state[0x722],
                hours: state[0x723],
                minutes: state[0x724],
                seconds: state[0x725],
            },
            lastError: error,
        };

        for (let i = 0x80; i < 0xe4; i += 2) {
            const addr = pair(i);
            if (addr !== 0)
                result.breakpoints.push(addr);
        }

        Module._free(buf);

        return result;
    }

    downloadSdCardImage() : Uint8Array {

        const bufferSize = this.sdCardImageSizeMB * 1024 * 1024;

        const buf = Module._malloc(bufferSize);
        const compressedImageSize = this.api!.compressSDCard(buf, bufferSize);
        const compressedImage = new Uint8Array(Module.HEAP8.buffer, buf, compressedImageSize).slice(0);

        Module._free(buf);

        return compressedImage;
    }

    addBreakpoint(addr: number) : void {
        this.api!.addBreakpoint(addr);
    }

    removeBreakpoint(addr: number) : void {
        this.api!.removeBreakpoint(addr);
    }

    setRam(addr: number, data: Uint8Array) : void {
        for (let i = 0; i < data.length; ++i)
            this.api!.setRam(addr + i, data[i]);
    }

    getUartPrintedChars() : string[] {

        const maxSize = this.api!.maxPrintedChars();

        const buf = Module._malloc(maxSize);
        const sz = this.api!.unloadPrintedChars(buf, maxSize);
        const charArray = new Uint8Array(Module.HEAP8.buffer, buf, sz).slice();

        const r = String.fromCharCode(...charArray).split("");
        Module._free(buf);
        return r;
    }

    keypress(chr: number) : void {
        this.api!.keypress(chr);
    }

    fsDir(dir: string) : FilesystemFile[] {

        // record format:
        //   0~A: filename
        //   B~E: size
        //   F: file type

        const MAX_RECORDS = 512;
        const RECORD_SZ = 0x10;
        const buf = Module._malloc(MAX_RECORDS * RECORD_SZ);

        const numberOfRecords = this.api!.fsDir(dir, MAX_RECORDS, buf);
        if (numberOfRecords < 0)
            throw new Error(`Error while reading directory: ${-numberOfRecords}.`);
        const state = new Uint8Array(Module.HEAP8.buffer, buf, numberOfRecords * RECORD_SZ).slice();
        const quad = (n: number) : number => state[n] + (state[n+1] << 8) + (state[n+2] << 16) + (state[n+3] << 24);

        const transformFilename = (dosFormat: string) : string => {
            if (dosFormat.startsWith(".."))
                return "..";
            const name = dosFormat.slice(0, 8).trim();
            const extension = dosFormat.slice(8, 11).trim();
            if (extension !== "")
                return name + "." + extension;
            return name;
        };

        const result : FilesystemFile[] = [];
        for (let i = 0; i < numberOfRecords; ++i) {
            const baseLine = i * RECORD_SZ;
            result.push({
                filename: transformFilename(this.textDecoder.decode(state.slice(baseLine, baseLine + 0xb))),
                size: quad(baseLine + 0xb),
                fileType: state[baseLine + 0xf],
            });
        }

        Module._free(buf);

        return result;
    }

    fsFilePage(dir: string, filename: string, page: number) : Uint8Array {

        const buf = Module._malloc(256);

        const sz = this.api!.fsFilePage(dir, filename, page, buf);
        if (sz < 0)
            throw new Error(`Error while reading file page: ${-sz}.`);

        const array = new Uint8Array(Module.HEAP8.buffer, buf, sz).slice();

        Module._free(buf);

        return array;
    }

    fsChdirUp(dir: string) : string {
        if (dir === "" || dir === "/")
            return "/";

        const newPath = dir.split("/").filter(v => v !== "");
        newPath.pop();
        return "/" + newPath.join("/");
    }

    private static async loadWasmModule(wasmFilePath: string) : Promise<void> {
        const script = document.createElement("script");
        script.src = `${wasmFilePath}/fortuna.js`;
        script.async = true;
        document.body.appendChild(script);

        const waitForScript = async () => new Promise<void>(resolve => script.onload = () => resolve());
        await waitForScript();

        const waitForModuleInitialization = async () => new Promise<void>(resolve => Module.onRuntimeInitialized = () => resolve());
        await waitForModuleInitialization();
    }

}