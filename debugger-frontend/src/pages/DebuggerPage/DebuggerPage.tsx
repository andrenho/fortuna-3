import React, {useEffect, useState} from "react";
import {observer} from "mobx-react-lite";
import RAM from "components/memory/Ram/Ram";
import CPU from "components/cpu/Cpu";
import Debugger from "components/debugger/Debugger";
import UART from "components/uart/UART";
import useStore from "hooks/useStore";
import Toolbar, {ToolbarButton, ToolbarSeparator, ToolbarToggle} from "components/main-page/Toolbar/Toolbar";
import {faAngleRight, faArrowsTurnRight, faPause, faPlay, faPowerOff, faWrench} from '@fortawesome/free-solid-svg-icons'
import ComputeUnit from "components/compute-unit/ComputeUnit";
import css from 'pages/DebuggerPage/DebuggerPage.module.scss';
import FlatData from "components/common/FlatData/FlatData";
import Lcd from "components/lcd/Lcd";
import Rtc from "components/rtc/Rtc";
import Box from "components/common/Box/Box";
import translateKey from "util/translateKey";
import CompilerOptions from "components/compiler-options/CompilerOptions";

const Components : React.FC = observer(() => {

    const store = useStore();

    const [showCpu, setShowCpu] = useState(true);
    const [showCompute, setShowCompute] = useState(true);
    const [showUart, setShowUart] = useState(true);
    const [showRam, setShowRam] = useState(false);
    const [showEeprom, setShowEeprom] = useState(false);
    const [showLcd, setShowLcd] = useState(false);
    const [showRtc, setShowRtc] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    const onKeyDown = (e : KeyboardEvent) => {
        switch (e.key) {
            case "F8":
                store.step();
                return;
            case "F9":
                store.next();
                return;
            case "F5":
                if (!store.running)
                    store.run();
                e.preventDefault();
                return;
            case "c":
                if (e.ctrlKey && store.running) {
                    store.stopExecution();
                    return;
                }
                break;
        }

        const keyCode = translateKey(e.key, e.shiftKey);
        if (keyCode)
            store.keypress(keyCode);
    }

    const onReset = () => {
        if (window.confirm("Are you sure you want to reset the emulation?"))
            store.reset();
    }

    useEffect(() => {
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);   // eslint-disable-line react-hooks/exhaustive-deps

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
                <ToolbarToggle icon={faWrench} value={showOptions} onToggle={() => setShowOptions(!showOptions)} />
                <ToolbarSeparator />
                <ToolbarButton icon={faAngleRight} title="Step one instruction (F8)" onClick={() => store.step()} />
                <ToolbarButton icon={faArrowsTurnRight} title="Jump to next instruction (F9)" onClick={() => store.next()} />
                { store.running
                    ? <ToolbarButton icon={faPause} color="red" title="Stop execution" onClick={() => store.stopExecution()} />
                    : <ToolbarButton icon={faPlay} color="green" title="Run (F5)" onClick={() => store.run()} />
                }
            </Toolbar>
        </div>

        <div className={css.page}>
            <Debugger />
            <div className={css.rightSide}>

                { showCpu && <CPU cpu={store.state.cpu} running={store.running} /> }

                { showCompute && <ComputeUnit
                    p={store.state.computeUnit.p}
                    q={store.state.computeUnit.q}
                    r={store.state.computeUnit.r}
                    running={store.running} /> }

                { showUart && <UART 
                    rows={store.uartTerminal.terminalRows}
                    columns={store.uartTerminal.terminalColumns} 
                    cursorX={store.uartTerminal.cursorX}
                    cursorY={store.uartTerminal.cursorY}
                    lines={store.uartTerminal.lines}
                    lastKeyPressed={store.lastKeyPressed}
                    onCancelLastKeypress={() => store.keypress(0)}
                /> }

                { showRam && <RAM
                    pc={store.state.cpu.pc}
                    ramPage={store.ramPage}
                    ramBank={store.state.ramBank}
                    stack={store.state.stack}
                    bytes={store.state.ramPage}
                    onPageChange={n => store.setRamPage(n)}
                    running={store.running}
                /> }

                { showLcd && <Lcd line1={store.state.lcd[0]} line2={store.state.lcd[1]} /> }

                { showRtc && <Rtc
                    year={store.state.rtc.year}
                    month={store.state.rtc.month}
                    day={store.state.rtc.day}
                    hours={store.state.rtc.hours}
                    minutes={store.state.rtc.minutes}
                    seconds={store.state.rtc.seconds}
                    running={store.running}
                /> }

                { showEeprom && <Box title="EEPROM" running={store.running}>
                    <FlatData
                        bytes={store.state.eepromPage}
                        currentPage={store.eepromPage}
                        onPageChange={n => store.setEepromPage(n)}
                        rows={16}
                        totalPages={16}
                    />
                </Box> }

                { showOptions &&
                    <CompilerOptions
                        options={store.options}
                        onUpdate={(opt) => store.updateOptions(opt)}
                    />
                }

            </div>
        </div>
    </>;
});

export default Components;