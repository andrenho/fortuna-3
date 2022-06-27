export type SourceLine = {
    source: string,
    address?: number | undefined,
    bytes?: number[] | undefined,
};

export default interface DebuggingInfo {
    files: string[],
    code: {[key: string]: SourceLine[]},
}

export function initialDebuggingInfo() : DebuggingInfo {
    /*
    return {
        files: ["no_file"],
        code: {
            no_file: [{ source: "No project loaded." }],
        },
    };
     */
    return {
        files: ["main.z80", "hello.z80"],
        code: {
            "main.z80": [
                { source: "; Hello world!" },
                { source: "    nop  ; do nothing", address: 0, bytes: [0] },
                { source: "x:  jp x", address: 2, bytes: [0xc3, 0xc3, 0xc3] },
            ],
            "hello.z80": [
                { source: "ret", address: 1, bytes: [0xf4] },
            ]
        }
    };
}