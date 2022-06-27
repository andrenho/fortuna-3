hex = (value, pad=2, withPrefix=false) => (withPrefix ? "0x" : "") + value.toString(16).padStart(pad, '0');

toWords = (bytes) => Uint16Array.from(Array.from({ length: bytes.length / 2 }, (_, i) => bytes[i*2] + (bytes[(i*2)+1] * 256)));
