import {observer} from "mobx-react-lite";
import FlatData from "components/common/flat-data/FlatData";
import css from "./SDCard.module.scss";
import FileSaver from "file-saver";
import Box from "components/common/box/Box";

type SDCardProps = {
    currentPage: number,
    sdCardSizeInMB: number,
    currentPageBytes: Uint8Array,
    onPageChange : (n : number) => void,
    getCompressedImageBytes : () => Uint8Array,
    children?: React.ReactNode
}

const SDCard : React.FC<SDCardProps> = observer(({ currentPage, sdCardSizeInMB, currentPageBytes, getCompressedImageBytes, onPageChange, children}) => {

    const downloadLinkClicked = () => {
        const bytes = getCompressedImageBytes();
        if (bytes.length > 0) {
            const blob = new Blob([bytes], { type: "application/zip" });
            FileSaver.saveAs(blob, "sdcard.zip");
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
            </div>
            { children }
        </div>
    </Box>;
});

export default SDCard;