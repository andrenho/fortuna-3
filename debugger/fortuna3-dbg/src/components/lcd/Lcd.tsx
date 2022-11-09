import React from "react";
import css from "./Lcd.module.scss";
import Box from "components/common/box/Box";

type LcdProps = {
    line1: string,
    line2: string,
}

const Lcd : React.FC<LcdProps> = ({ line1, line2 }) => {

    const line = (str: string) => str.split("").map(c => <pre className={css.char}>{ c }</pre>);

    return <Box title="LCD">
        <div className={css.lcd}>
            <div className={css.line}>{ line(line1) }</div>
            <div className={css.line}>{ line(line2) }</div>
        </div>
    </Box>;
};

export default Lcd;