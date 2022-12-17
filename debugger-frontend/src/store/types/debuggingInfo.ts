export interface SourceLine {
    line: string,
    address?: number | undefined,
    bytes?: number[] | undefined,
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

export default interface DebuggingInfo {
    success: boolean,
    projects: {[key: string]: SourceProject},
    errorMessage?: string,
    sdCardSizeInMB: number,
    hash: number,
}

export function initialDebuggingInfo() : DebuggingInfo {
    return {
        success: false,
        errorMessage: "No project loaded",
        projects: {},
        hash: 0,
        sdCardSizeInMB: 0,
    }
}