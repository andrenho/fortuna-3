import DebuggingInfo from "store/types/debuggingInfo";
import RemoteOptions from "store/types/remoteOptions";

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

export async function fetchBackendRemote(remoteIp: string, action: string, arg?: string | undefined) : Promise<string> {
    let url = `${backendHostname()}/remote/${remoteIp}/${action}`;
    if (arg)
        url += `/${arg}`;
    const result = await fetch(url, { method: 'POST' });
    if (!result.ok)
        throw new Error((await result.json()).message);
    return await result.text();
}

export async function fetchPutOptions(options: RemoteOptions) : Promise<RemoteOptions> {
    let url = `${backendHostname()}/options`;
    const result = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(options)
    });
    if (!result.ok)
        throw new Error((await result.json()).message);
    return await result.json();
}