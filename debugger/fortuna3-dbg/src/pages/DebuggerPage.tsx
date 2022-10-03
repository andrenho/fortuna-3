import React, { useState } from "react";
import {observer} from "mobx-react-lite";
import RAM from "components/memory/Ram";
import CPU from "components/cpu/Cpu";
import Debugger from "components/debugger/Debugger";
import UART from "components/uart/UART";
import useStore from "hooks/useStore";
import css from './DebuggerPage.module.scss';
import Toolbar, { ToolbarToggle } from "components/main-page/Toolbar";

const Components : React.FC = observer(() => {

    const store = useStore();

    const [showCpu, setShowCpu] = useState(true);
    const [showUart, setShowUart] = useState(true);
    const [showRam, setShowRam] = useState(false);

    return <>
        <div className={css.toolbar}>
            <Toolbar>
                <ToolbarToggle text="CPU" value={showCpu} onToggle={() => setShowCpu(!showCpu)} />
                <ToolbarToggle text="RAM" value={showRam} onToggle={() => setShowRam(!showRam)} />
                <ToolbarToggle text="UART" value={showUart} onToggle={() => setShowUart(!showUart)} />
            </Toolbar>
        </div>

        <div style={{display: "flex", flexDirection: "row", gap: "16px", flexWrap: "wrap", alignItems: "flex-start"}}>
            <Debugger />
            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                { showCpu && <CPU cpu={store.state.cpu} /> }
                { showUart && <UART 
                    rows={store.uartTerminal.terminalRows}
                    columns={store.uartTerminal.terminalColumns} 
                    cursorX={store.uartTerminal.cursorX}
                    cursorY={store.uartTerminal.cursorY}
                    lines={store.uartTerminal.lines}
                /> }
                { showRam && <RAM
                    pc={store.state.cpu.pc}
                    ramPage={store.ramPage}
                    ramBanks={store.state.ramBanks}
                    stack={store.state.stack}
                    bytes={store.state.ramPage}
                    onPageChange={n => store.setRamPage(n)}
                /> }
            </div>
        </div>
    </>;
});

export default Components;