export default function translateKey(key: string, shift: boolean) : number | undefined {
    switch (key) {
        case "Enter":
            return 10;
        case "Tab":
            return 9;
        case "Backspace":
            return 8;
        case "Delete":
            return 127;
        case "Escape":
            return 27;
    }

    if (key.length === 1) {
        return key.codePointAt(0);
    }

    return undefined;
}