import React from 'react';
import {observer} from "mobx-react-lite";
import SDCard from "components/sdcard/SDCard";
import useStore from 'hooks/useStore';
import Filesystem from 'components/sdcard/Filesystem';

const SDCardPage : React.FC = observer(() => {

    const store = useStore();
    const {filesystem} = store;
    const selectedFile = filesystem.selectedFile?.filename;

    if (store.debuggingInfo === undefined)
        return <></>;

    return <SDCard
        currentPage={store.sdCardPage}
        sdCardSizeInMB={store.debuggingInfo.sdCardSizeInMB}
        currentPageBytes={store.state.sdCardPage}
        onPageChange={n => store.setSdCardPage(n)}
        getCompressedImageBytes={() => store.downloadSdCardImage()}>
        
        <Filesystem
            fileList={filesystem.fileList}
            selectedFile={selectedFile}
            selectedFileSize={filesystem.selectedFile?.size}
            selectedPage={filesystem.selectedPage}
            pageContents={filesystem.pageContents}
            onFileSelect={(selected) => filesystem.updateFromEmulator(selected, 0)}
            onPageChange={(page) => filesystem.updateFromEmulator(selectedFile, page)}
        />

    </SDCard>
});

export default SDCardPage;
