import {observer} from "mobx-react-lite";
import useStore from "../hooks/useStore";
import FlatData from "./FlatData";
import {StyleSet} from "../util/types";

const style : StyleSet = {
    link: {
        paddingRight: "8px",
        display: "inline-block",
        width: "100%",
        textAlign: "right",
        color: "blue",
        textDecoration: "none",
    }
}

const SDCard = observer(() : JSX.Element => {

    const store = useStore();
    const state = store.state!;

    return (<FlatData
        title="SD Card"
        currentPage={store.sdCardPage}
        totalPages={store.sdCardSizeInMB * 2048}
        rows={32}
        data={state?.sdCardPage!}
        onPageChange={n => store.setSdCardPage(n)}
        topRightElement={<a style={style.link} href="#">&#x1f4be; Download disk image</a>}
    />);
});

export default SDCard;