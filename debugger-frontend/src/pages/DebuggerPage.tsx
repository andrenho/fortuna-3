import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import RAM from "components/memory/Ram";
import CPU from "components/cpu/Cpu";
import Debugger from "components/debugger/Debugger";
import UART from "components/uart/UART";
import useStore from "hooks/useStore";
import Toolbar, {ToolbarButton, ToolbarSeparator, ToolbarToggle} from "components/main-page/Toolbar";
import {faForward, faForwardStep, faPause, faPowerOff, faSquareCaretRight} from '@fortawesome/free-solid-svg-icons'
import ComputeUnit from "components/compute-unit/ComputeUnit";
import css from './DebuggerPage.module.scss';
import FlatData from "components/common/flat-data/FlatData";
import Lcd from "components/lcd/Lcd";
import Rtc from "components/rtc/Rtc";
import Box from "components/common/box/Box";

const Components : React.FC = observer(() => {

    const store = useStore();

    const [showCpu, setShowCpu] = useState(true);
    const [showCompute, setShowCompute] = useState(true);
    const [showUart, setShowUart] = useState(true);
    const [showRam, setShowRam] = useState(false);
    const [showEeprom, setShowEeprom] = useState(false);
    const [showLcd, setShowLcd] = useState(false);
    const [showRtc, setShowRtc] = useState(false);

    const onKeyDown = (e : KeyboardEvent) => {
        switch (e.key) {
            case "F8": store.step(); break;
        }
        const c = e.key.charCodeAt(0);
        if (c >= 32 && c <= 127)
            store.keypress(c);
    }

    const onReset = () => {
        if (window.confirm("Are you sure you want to reset the emulation?"))
            store.reset();
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    return <>
        <div className={css.toolbar}>
            <Toolbar>
                <ToolbarToggle text="CPU" value={showCpu} onToggle={() => setShowCpu(!showCpu)} />
                <ToolbarToggle text="Comp" title="Compute unit" value={showCompute} onToggle={() => setShowCompute(!showCompute)} />
                <ToolbarToggle text="UART" value={showUart} onToggle={() => setShowUart(!showUart)} />
                <ToolbarToggle text="RAM" value={showRam} onToggle={() => setShowRam(!showRam)} />
                <ToolbarToggle text="LCD" value={showLcd} onToggle={() => setShowLcd(!showLcd)} />
                <ToolbarToggle text="RTC" value={showRtc} onToggle={() => setShowRtc(!showRtc)} />
                <ToolbarToggle text="PROM" value={showEeprom} onToggle={() => setShowEeprom(!showEeprom)} />
                <ToolbarSeparator />
                <ToolbarButton icon={faPowerOff} title="Reset emulator" onClick={onReset} />
                <ToolbarSeparator />
                <ToolbarButton icon={faForwardStep} title="Step one instruction (F8)" onClick={() => store.step()} />
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

                { showLcd && <Lcd line1={store.state.lcd[0]} line2={store.state.lcd[1]} /> }

                { showRtc && <Rtc
                    year={store.state.rtc.year}
                    month={store.state.rtc.month}
                    day={store.state.rtc.day}
                    hours={store.state.rtc.hours}
                    minutes={store.state.rtc.minutes}
                    seconds={store.state.rtc.seconds}
                /> }

                { showEeprom && <Box title="EEPROM">
                    <FlatData
                        bytes={store.state.eepromPage}
                        currentPage={store.eepromPage}
                        onPageChange={n => store.setEepromPage(n)}
                        rows={16}
                        totalPages={16}
                    />
                </Box> }

            </div>
        </div>
    </>;
});

export default Components;