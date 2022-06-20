export function hex(value: number, pad=2, withPrefix=false) : string {
    return (withPrefix ? "0x" : "") + value.toString(16).padStart(pad, '0').toUpperCase();
}