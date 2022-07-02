import {hex} from "../../util/hex";

type RegisterProps = {
    name: string,
    value: number,
    size: number,
}

const Register = (props: RegisterProps) : JSX.Element => {
    return (<div>
        <div style={{fontWeight: "bold", fontSize: "11px"}}>{ props.name }</div>
        <div style={{border: "1px black solid", padding: "2px"}}>{ hex(props.value, props.size) }</div>
    </div>);
};

export default Register;