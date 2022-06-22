import SDCard from "../components/SDCard";
import useStore from "../hooks/useStore";
import {StyleSet} from "../util/types";
import {observer} from "mobx-react-lite";
import RAM from "../components/Ram";

const Components = observer(() : JSX.Element => {

    return (<>
        <RAM />
    </>);
});

export default Components;