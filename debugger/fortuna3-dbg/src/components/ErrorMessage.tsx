import {observer} from "mobx-react-lite";
import useStore from "../hooks/useStore";
import {StyleSet} from "../util/types";
import React from "react";

const style : StyleSet = {
    error: {
        color: "red",
        fontSize: "x-large",
        border: "2px red solid",
        padding: "16px",
    }
};

const ErrorMessage = observer(() : JSX.Element => {

    const { currentError } = useStore();

    if (currentError != null)
        return <div style={style.error}>{ currentError }</div>;
    else
        return <></>;
});

export default ErrorMessage;