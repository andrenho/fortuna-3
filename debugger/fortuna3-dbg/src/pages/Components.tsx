import {observer} from "mobx-react-lite";
import RAM from "../components/memory/Ram";
import CPU from "../components/other/Cpu";
import Debugger from "../components/code/Debugger";

const Components = observer(() : JSX.Element => {

    return (<>
        <Debugger />
        <CPU />
        <RAM />
    </>);
});

export default Components;