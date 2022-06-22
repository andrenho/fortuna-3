import {observer} from "mobx-react-lite";
import {StyleSet} from "../util/types";
import useStore from "../hooks/useStore";

const style : StyleSet = {
    container: {
        paddingRight: "8px",
        width: "100%",
        textAlign: "right",
    },
    link: {
        color: "blue",
        textDecoration: "none",
        cursor: "pointer",
    }
}


const SDCardImageDownloader = observer(() : JSX.Element => {

    const store = useStore();

    const linkClicked = () => {
        store.downloadSdCardImage();
    };

    return <div style={style.container}><a style={style.link} onClick={linkClicked}>&#x1f4be; Download disk image</a></div>;
});

export default SDCardImageDownloader;