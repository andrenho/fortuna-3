import {observer} from "mobx-react-lite";
import {StyleSet} from "../util/types";
import useStore from "../hooks/useStore";
import FileSaver from "file-saver";

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
        const bytes = store.downloadSdCardImage();
        if (bytes.length > 0) {
            const blob = new Blob([bytes], { type: "application/zip" });
            FileSaver.saveAs(blob, "sdcard.zip");
        }
    };

    return <div style={style.container}><span style={style.link} onClick={linkClicked}>&#x1f4be; Download disk image</span></div>;
});

export default SDCardImageDownloader;