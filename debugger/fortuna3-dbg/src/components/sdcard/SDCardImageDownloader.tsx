import React from "react";
import {observer} from "mobx-react-lite";
import useStore from "hooks/useStore";
import FileSaver from "file-saver";
import css from "css/sdcard/SDCardImageDownloader.module.scss";

const SDCardImageDownloader : React.FC = observer(() => {

    const store = useStore();

    const linkClicked = () => {
        const bytes = store.downloadSdCardImage();
        if (bytes.length > 0) {
            const blob = new Blob([bytes], { type: "application/zip" });
            FileSaver.saveAs(blob, "sdcard.zip");
        }
    };

    return <div className={css.container}>
        <span className={css.link} onClick={linkClicked}>&#x1f4be; Download disk image</span>
    </div>;
});

export default SDCardImageDownloader;