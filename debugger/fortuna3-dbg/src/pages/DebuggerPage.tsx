import React, { useState } from "react";
import {observer} from "mobx-react-lite";
import RAM from "components/memory/Ram";
import CPU from "components/cpu/Cpu";
import Debugger from "components/debugger/Debugger";
import UART from "components/uart/UART";
import useStore from "hooks/useStore";
import css from './DebuggerPage.module.scss';
import Toolbar, { ToolbarActive, ToolbarIconOrSeparator } from "components/main-page/Toolbar";

const toolbarIcons : ToolbarIconOrSeparator[] = [
    { key: "cpu", text: "CPU" },
    { key: "ram", text: "RAM" },
    { key: "uart", text: "UART" }
];

const Components : React.FC = observer(() => {

    const store = useStore();

    const [activeIcons, setActiveIcons] = useState<ToolbarActive>({
        "cpu": true,
        "uart": true,
    });

    const activateComponent = (key: string) => {
        setActiveIcons({...activeIcons, [key]: !activeIcons[key]});
    };

    return <>
        <div className={css.toolbar}>
            <Toolbar
                icons={toolbarIcons}
                active={activeIcons}
                onToggle={(key) => activateComponent(key)}
            />
        </div>

        <div style={{display: "flex", flexDirection: "row", gap: "16px", flexWrap: "wrap", alignItems: "flex-start"}}>
            <Debugger />
            <div style={{display: "flex", flexDirection: "column", alignItems: "flex-start"}}>
                { activeIcons["cpu"] && <CPU cpu={store.state.cpu} /> }
                { activeIcons["uart"] && <UART 
                    rows={store.uartTerminal.terminalRows}
                    columns={store.uartTerminal.terminalColumns} 
                    cursorX={store.uartTerminal.cursorX}
                    cursorY={store.uartTerminal.cursorY}
                    lines={store.uartTerminal.lines}
                /> }
                { activeIcons["ram"] && <RAM
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