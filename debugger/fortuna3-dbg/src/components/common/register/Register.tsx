import React from "react";
import Hex from "../hex/Hex";
import css from "./Register.module.scss"

type RegisterProps = {
    name: string,
    value: number,
    size: number,
}

const Register : React.FC<RegisterProps> = ({ name, value, size }) => {
    return <div>
        <div className={css.name}>{ name }</div>
        <div className={css.value}><Hex value={value} pad={size} /></div>
    </div>;
};

export default Register;