import React from "react";
import css from "./Lcd.module.scss";
import Box from "components/common/Box/Box";

type LcdProps = {
    line1: string,
    line2: string,
}

const Lcd : React.FC<LcdProps> = ({ line1, line2 }) => {

    const line = (str: string, n: number) => (str + " ".repeat(16)).substring(0, 16).split("").map((c, i) => {
        return <pre key={`lcd_${n}_${i}`} className={css.char}>{ (c.codePointAt(0)! > 32) ? c : ' ' }</pre>
    });

    return <Box title="LCD">
        <div className={css.lcd}>
            <div className={css.line}>{ line(line1, 1) }</div>
            <div className={css.line}>{ line(line2, 2) }</div>
        </div>
    </Box>;
};

export default Lcd;