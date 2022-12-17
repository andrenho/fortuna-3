import React from "react";
import {observer} from "mobx-react-lite";
import css from "./ErrorMessage.module.scss";

type ErrorMessageProps = {
    currentError: string | undefined;
}

const ErrorMessage : React.FC<ErrorMessageProps> = observer(({ currentError }) => {

    if (currentError != null)
        return <div className={css.error}>{ currentError }</div>;
    else
        return <></>;
});

export default ErrorMessage;