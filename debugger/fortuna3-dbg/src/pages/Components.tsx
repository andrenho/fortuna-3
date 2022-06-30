import {observer} from "mobx-react-lite";
import RAM from "../components/memory/Ram";
import CPU from "../components/other/Cpu";
import Debugger from "../components/code/Debugger";

const Components = observer(() : JSX.Element => {

    return (
        <div style={{display: "flex", flexDirection: "row", gap: "16px", flexWrap: "wrap", alignItems: "flex-start"}}>
            <Debugger />
            <div style={{display: "flex", flexDirection: "column"}}>
                <CPU />
                <RAM />
            </div>
        </div>
    );
});

export default Components;