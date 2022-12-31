import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React, {PropsWithChildren, useState} from "react";
import css from "./Toolbar.module.scss";

type ToolbarToggleProps = {
    value: boolean;
    icon?: IconProp;
    text?: string;
    color?: string;
    title?: string;
    onToggle?: () => void;
}

export const ToolbarToggle : React.FC<ToolbarToggleProps> = ({value, icon, text, title, color="black", onToggle=()=>{}}) => {

    return <div
        title={title}
        onClick={onToggle}
        className={`${css.button} ${value ? css.active : ''}`}
    >
        { icon && <FontAwesomeIcon
            icon={icon}
            fixedWidth
            color={color || 'black'}
            className={css.icon}
        /> }
        { text && <span className={css.buttonText}>
            { text }
        </span> }
    </div>;
};

type ToolbarButtonProps = {
    icon?: IconProp;
    text?: string;
    color?: string;
    title?: string;
    onClick?: () => void;
}

export const ToolbarButton : React.FC<ToolbarButtonProps> = ({icon, text, color, title, onClick=()=>{}}) => {

    const [value, setValue] = useState(false);
    const onToggle = () => {
        onClick();
        setValue(true);
        setTimeout(() => setValue(false), 50);
    };

    return <ToolbarToggle value={value} icon={icon} text={text} color={color} title={title} onToggle={onToggle} />;
};

export const ToolbarSeparator : React.FC = () => <div key="separator" className={css.separator} />;

const Toolbar : React.FC<PropsWithChildren> = ({children}) => {

    return <div className={css.toolbar}>
        { children }
    </div>;
};

export default Toolbar;