import {observer} from "mobx-react-lite";
import FlatData from "components/common/FlatData/FlatData";
import css from "components/sdcard/SDCard/SDCard.module.scss";
import FileSaver from "file-saver";
import Box from "components/common/Box/Box";
import React from "react";

type SDCardProps = {
    currentPage: number,
    sdCardSizeInMB: number,
    currentPageBytes: Uint8Array,
    onPageChange : (n : number) => void,
    getCompressedImageBytes : () => Uint8Array,
    sdCardEjected: boolean,
    onSdCardEject: (status: boolean) => void,
    children?: React.ReactNode
}

const SDCard : React.FC<SDCardProps> = observer(({ currentPage, sdCardSizeInMB, currentPageBytes, getCompressedImageBytes, onPageChange, sdCardEjected, onSdCardEject, children}) => {

    const downloadLinkClicked = () => {
        const bytes = getCompressedImageBytes();
        if (bytes.length > 0) {
            const blob = new Blob([bytes], { type: "application/zip" });
            FileSaver.saveAs(blob, "sdcard.zip", { autoBom: false });
        }
    };

    const SDCardDownloadLink : React.FC = () => <div className={css.linkContainer}>
        <span className={css.link} onClick={downloadLinkClicked}>&#x1f4be; Download disk image</span>
    </div>;

    return <Box title="SD Card">
        <div className={css.mainContainer}>
            <div className={css.flatdataWithSeparator}>
                <FlatData
                    currentPage={currentPage}
                    totalPages={sdCardSizeInMB * 2048}
                    rows={32}
                    bytes={currentPageBytes}
                    onPageChange={onPageChange}
                    topRightElement={<SDCardDownloadLink/>}
                />
                <div>
                    <input type="checkbox" id="ejected" checked={sdCardEjected} onChange={e => onSdCardEject(e.target.checked)} />
                    <label htmlFor="ejected">SDCard ejected</label>
                </div>
            </div>
            { children }
        </div>
    </Box>;
});

export default SDCard;