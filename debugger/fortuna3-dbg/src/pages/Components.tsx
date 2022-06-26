import {observer} from "mobx-react-lite";
import RAM from "../components/Ram";
import CPU from "../components/Cpu";

const Components = observer(() : JSX.Element => {

    return (<>
        <CPU />
        <RAM />
    </>);
});

export default Components;