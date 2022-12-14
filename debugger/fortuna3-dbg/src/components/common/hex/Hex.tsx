type HexProps = {
    value?: number,
    pad?: number,
    withPrefix?: boolean,
    prefix?: string,
    postfix?: string,
    showTag?: boolean,
    style?: React.CSSProperties,
    spaceAfter?: boolean,
}

const Hex : React.FC<HexProps> = ({value, pad=2, withPrefix=false, prefix="0x", postfix="", style={}, showTag=true, spaceAfter=false}) => {
    let valueStr: string;
    let title: string;
    if (value !== undefined) {
        valueStr = (withPrefix ? prefix : "") + value.toString(16).padStart(pad, '0').toUpperCase() + postfix;
        title = "dec " + value + " | bin " + value.toString(2).padStart(pad * 4, '0');
    } else {
        valueStr = ".".repeat(pad);
        showTag = false;
    }
    const newStyle = {...style};
    if (spaceAfter)
        newStyle['marginRight'] = '6px';
    return <span style={newStyle} title={showTag ? title! : undefined}>{ valueStr }</span>;
};

export default Hex;