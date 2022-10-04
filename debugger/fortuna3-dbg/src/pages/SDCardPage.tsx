import React from 'react';
import {observer} from "mobx-react-lite";
import SDCard from "components/sdcard/SDCard";
import useStore from 'hooks/useStore';

const SDCardPage : React.FC = observer(() => {

    const store = useStore();

    if (store.debuggingInfo === undefined)
        return <></>;

    return <SDCard
        currentPage={store.sdCardPage}
        sdCardSizeInMB={store.debuggingInfo.sdCardSizeInMB}
        currentPageBytes={store.state.sdCardPage}
        onPageChange={n => store.setSdCardPage(n)}
        getCompressedImageBytes={() => store.downloadSdCardImage()}
    />;
});

export default SDCardPage;
