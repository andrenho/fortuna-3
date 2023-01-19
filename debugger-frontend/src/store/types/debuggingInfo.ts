export interface SourceLine {
    line: string,
    addresses?: number[],
    bytes?: number[],
    isMacro?: boolean,
}

export type Source = {[key: string]: SourceLine[]};

export interface SourceProject {
    success: boolean,
    mainSourceFile: string,
    source: Source,
    symbols: {[key: string]: number},
    labels: {[key: string]: number},
    binary: string,
    compilerError?: string,
}

export interface DebuggerSetup {
    sdCardSizeInMB: number,
    breakpoints?: number[],
    runOnLoad?: boolean,
}

export default interface DebuggingInfo {
    success: boolean,
    projects: {[key: string]: SourceProject},
    debuggerSetup: DebuggerSetup,
    errorMessage?: string,
    hash: number,
}

export function initialDebuggingInfo() : DebuggingInfo {
    return {
        success: false,
        errorMessage: "No project loaded",
        projects: {},
        hash: 0,
        debuggerSetup: {
            sdCardSizeInMB: 0,
            breakpoints: [],
            runOnLoad: false,
        }
    }
}