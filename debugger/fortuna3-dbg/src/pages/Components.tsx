import React from "react";
import {observer} from "mobx-react-lite";
import RAM from "components/memory/Ram";
import CPU from "components/Cpu";
import Debugger from "components/code/Debugger";
import UART from "components/UART";
import useStore from "hooks/useStore";

const Components : React.FC = observer(() => {

    const { uartTerminal } = useStore();

    return <div style={{display: "flex", flexDirection: "row", gap: "16px", flexWrap: "wrap", alignItems: "flex-start"}}>
        <Debugger />
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            <UART rows={uartTerminal.terminalRows} columns={uartTerminal.terminalColumns} />
            <CPU />
            <RAM />
        </div>
    </div>;
});

export default Components;