import React, { useState } from "react";
import {observer} from "mobx-react-lite";
import RAM from "components/memory/Ram";
import CPU from "components/cpu/Cpu";
import Debugger from "components/debugger/Debugger";
import UART from "components/uart/UART";
import useStore from "hooks/useStore";
import Toolbar, { ToolbarToggle, ToolbarButton, ToolbarSeparator } from "components/main-page/Toolbar";
import { faPowerOff, faForwardStep, faSquareCaretRight, faForward, faPause } from '@fortawesome/free-solid-svg-icons'
import ComputeUnit from "components/compute-unit/ComputeUnit";
import css from './DebuggerPage.module.scss';

const Components : React.FC = observer(() => {

    const store = useStore();

    const [showCpu, setShowCpu] = useState(true);
    const [showCompute, setShowCompute] = useState(true);
    const [showUart, setShowUart] = useState(true);
    const [showRam, setShowRam] = useState(false);

    const onReset = () => {
        if (window.confirm("Are you sure you want to reset the emulation?"))
            store.reset();
    }

    return <>
        <div className={css.toolbar}>
            <Toolbar>
                <ToolbarToggle text="CPU" value={showCpu} onToggle={() => setShowCpu(!showCpu)} />
                <ToolbarToggle text="Comp" value={showCompute} onToggle={() => setShowCompute(!showCompute)} />
                <ToolbarToggle text="UART" value={showUart} onToggle={() => setShowUart(!showUart)} />
                <ToolbarToggle text="RAM" value={showRam} onToggle={() => setShowRam(!showRam)} />
                <ToolbarSeparator />
                <ToolbarButton icon={faPowerOff} title="Reset emulator" onClick={onReset} />
                <ToolbarSeparator />
                <ToolbarButton icon={faForwardStep} title="Step one instruction" onClick={() => store.step()} />
                <ToolbarButton icon={faSquareCaretRight} title="Step one screenful" onClick={() => store.stepOneScreenful()} />
                { store.running
                    ? <ToolbarButton icon={faPause} title="Stop execution" onClick={() => store.stopExecution()} />
                    : <ToolbarButton icon={faForward} title="Run" onClick={() => store.run()} />
                }
            </Toolbar>
        </div>

        <div className={css.page}>
            <Debugger />
            <div className={css.rightSide}>
                { showCpu && <CPU cpu={store.state.cpu} /> }
                { showCompute && <ComputeUnit p={store.state.computeUnit.p} q={store.state.computeUnit.q} r={store.state.computeUnit.r} /> }
                { showUart && <UART 
                    rows={store.uartTerminal.terminalRows}
                    columns={store.uartTerminal.terminalColumns} 
                    cursorX={store.uartTerminal.cursorX}
                    cursorY={store.uartTerminal.cursorY}
                    lines={store.uartTerminal.lines}
                    onKeyPress={chr => store.keypress(chr)}
                /> }
                { showRam && <RAM
                    pc={store.state.cpu.pc}
                    ramPage={store.ramPage}
                    ramBank={store.state.ramBank}
                    stack={store.state.stack}
                    bytes={store.state.ramPage}
                    onPageChange={n => store.setRamPage(n)}
                /> }
            </div>
        </div>
    </>;
});

export default Components;