import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import css from "./Toolbar.module.scss";

type ToolbarIcon = {
    key: string,
    icon?: IconProp,
    text?: string,
    color?: string,
    description?: string,
};

export type ToolbarIconOrSeparator = ToolbarIcon | "separator";
export type ToolbarActive = {[key: string]: boolean};

type ToolbarProps = {
    icons: ToolbarIconOrSeparator[];
    active: ToolbarActive;
    onToggle: (key: string) => void;
}

const Toolbar : React.FC<ToolbarProps> = ({icons, active, onToggle}) => {
    let first = true;

    return <div className={css.toolbar}>
        {
            icons.map(icon => {

                if (icon === "separator") {

                    first = true;
                    return <div className={css.separator} />;

                } else {

                    const i = icon as ToolbarIcon;

                    const element = <div 
                        key={`title_${i.key}`}
                        title={i.description}
                        onClick={() => onToggle(i.key)}
                        className={`${css.button} ${first ? css.first : ''} ${active[i.key] ? css.active : ''}`}
                    >
                        { i.icon && <FontAwesomeIcon
                            icon={i.icon}
                            size="lg"
                            fixedWidth
                            color={i.color || 'black'}
                            className={css.icon}
                        /> }
                        { i.text && <span className={css.buttonText}>
                            { i.text }
                        </span> }
                    </div>;

                    first = false;
                    return element;
                }
            })
        }
    </div>;
};

export default Toolbar;