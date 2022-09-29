type HexProps = {
    value: number,
    pad: number,
    withPrefix: boolean,
    postfix: string,
    showTag: boolean,
    style: React.CSSProperties,
}

const Hex : React.FC<HexProps> = ({value, pad=2, withPrefix=false, postfix="", style={}, showTag=true}) => {
    const valueStr = (withPrefix ? "0x" : "") + value.toString(16).padStart(pad, '0').toUpperCase() + postfix;
    const title = "dec " + value + " | bin " + value.toString(2).padStart(pad * 4, '0');
    return <span style={style} title={showTag ? title : undefined}>{ valueStr }</span>;
};

export default Hex;