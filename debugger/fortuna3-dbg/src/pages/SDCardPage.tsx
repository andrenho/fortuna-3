import React from 'react';
import {observer} from "mobx-react-lite";
import SDCard from "components/sdcard/SDCard";
import useStore from 'hooks/useStore';

const SDCardPage : React.FC = observer(() => {

    const { sdCardPage, setSdCardPage, downloadSdCardImage, debuggingInfo, state } = useStore();

    return <SDCard
        currentPage={sdCardPage}
        sdCardSizeInMB={debuggingInfo.sdCardSizeInMB}
        currentPageBytes={state.sdCardPage}
        onPageChange={n => setSdCardPage(n)}
        getCompressedImageBytes={downloadSdCardImage}
    />;
});

export default SDCardPage;
