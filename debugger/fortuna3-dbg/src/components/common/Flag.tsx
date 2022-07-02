type FlagProps = {
    name: string,
    value: boolean,
};

const Flag = (props: FlagProps) : JSX.Element => {
    return (<label>
        <input type="checkbox" onChange={() => false} checked={props.value} />
        <span>{ props.name }</span>
    </label>);
};

export default Flag;