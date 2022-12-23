import DebuggingInfo from "store/types/debuggingInfo";

function backendHostname() {
    return window.location.href.replace("8024", "8025");
}

export async function fetchBackendCrc() : Promise<number> {
    const result = await fetch(`${backendHostname()}/compiler/crc`);
    if (!result.ok)
        throw new Error("Error loading CRC form the backend");
    return await result.json();
}

export async function fetchBackendCompilation() : Promise<DebuggingInfo> {
    const result = await fetch(`${backendHostname()}/compiler/output`);
    if (!result.ok)
        throw new Error("Error loading CRC form the backend");
    return await result.json();
}

export async function fetchBackendRemote(action: string, arg?: string | undefined) : Promise<string> {
    let url = `${backendHostname()}/remote/${action}`;
    if (arg)
        url += `/${arg}`;
    const result = await fetch(url, { method: 'POST' });
    if (!result.ok)
        throw new Error((await result.json()).message);
    return await result.text();
}