import React from "react";
import Hex from "../Hex/Hex";
import css from "./Register.module.scss"

type RegisterProps = {
    name: string,
    value: number,
    size: number,
    className?: string,
}

const Register : React.FC<RegisterProps> = ({ name, value, size, className }) => {
    return <div className={className}>
        <div className={css.name}>{ name }</div>
        <div className={css.value}><Hex value={value} pad={size} /></div>
    </div>;
};

export default Register;