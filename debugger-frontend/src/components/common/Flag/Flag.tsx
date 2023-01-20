import React from "react";

type FlagProps = {
    name: string,
    value: boolean,
};

const Flag : React.FC<FlagProps> = ({ name, value }) => {
    return <label>
        <input type="checkbox" onChange={() => false} checked={value} />
        <span>{ name }</span>
    </label>;
};

export default Flag;