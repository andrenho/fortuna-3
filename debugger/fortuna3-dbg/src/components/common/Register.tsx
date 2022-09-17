import React from "react";
import {hex} from "util/hex";
import css from "css/common/Register.module.scss"

type RegisterProps = {
    name: string,
    value: number,
    size: number,
}

const Register : React.FC<RegisterProps> = ({ name, value, size }) => {
    return <div>
        <div className={css.name}>{ name }</div>
        <div className={css.value}>{ hex(value, size) }</div>
    </div>;
};

export default Register;