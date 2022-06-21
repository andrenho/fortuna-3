import SDCard from "../components/SDCard";
import useStore from "../hooks/useStore";
import {StyleSet} from "../util/types";
import {observer} from "mobx-react-lite";

const style : StyleSet = {
    error: {
        color: "red",
        fontSize: "x-large",
    }
};

const Components = observer(() : JSX.Element => {

    const { state } = useStore();

    return (<>
        { <div style={style.error}>{ state.lastError }</div> }
        <SDCard />
    </>);
});

export default Components;