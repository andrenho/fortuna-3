import {observer} from "mobx-react-lite";
import {StyleSet} from "../util/types";
import useStore from "../hooks/useStore";

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


const SDCardImageDownloader = observer(() : JSX.Element => {

    const store = useStore();

    const linkClicked = () => {
        store.downloadSdCardImage();
    };

    return <a style={style.link} onClick={linkClicked}>&#x1f4be; Download disk image</a>;
});

export default SDCardImageDownloader;