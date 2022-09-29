import React from "react";
import {observer} from "mobx-react-lite";
import RAM from "components/memory/Ram";
import CPU from "components/cpu/Cpu";
import Debugger from "components/debugger/Debugger";
import UART from "components/uart/UART";
import useStore from "hooks/useStore";

const Components : React.FC = observer(() => {

    const store = useStore();

    return <div style={{display: "flex", flexDirection: "row", gap: "16px", flexWrap: "wrap", alignItems: "flex-start"}}>
        <Debugger />
        <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
            <UART 
                rows={store.uartTerminal.terminalRows}
                columns={store.uartTerminal.terminalColumns} 
                cursorX={store.uartTerminal.cursorX}
                cursorY={store.uartTerminal.cursorY}
                lines={store.uartTerminal.lines}
            />
            <CPU cpu={store.state.cpu} />
            <RAM
                pc={store.state.cpu.pc}
                ramPage={store.ramPage}
                ramBanks={store.state.ramBanks}
                stack={store.state.stack}
                bytes={store.state.ramPage}
                onPageChange={n => store.setRamPage(n)}
            />
        </div>
    </div>;
});

export default Components;