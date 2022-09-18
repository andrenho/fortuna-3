import React from "react";
import {observer} from "mobx-react-lite";
import useStore from "hooks/useStore";
import css from "css/ErrorMessage.module.scss";

const ErrorMessage : React.FC = observer(() => {

    const { currentError } = useStore();

    if (currentError != null)
        return <div className={css.error}>{ currentError }</div>;
    else
        return <></>;
});

export default ErrorMessage;