import React from 'react';
import {observer} from "mobx-react-lite";
import SDCard from "components/sdcard/SDCard";
import useStore from 'hooks/useStore';
import Filesystem from 'components/sdcard/Filesystem';

const SDCardPage : React.FC = observer(() => {

    const store = useStore();
    const filesystem = store.filesystem!;

    if (store.debuggingInfo === undefined)
        return <></>;

    console.log(filesystem.selectedFile);

    return <SDCard
        currentPage={store.sdCardPage}
        sdCardSizeInMB={store.debuggingInfo.sdCardSizeInMB}
        currentPageBytes={store.state.sdCardPage}
        onPageChange={n => store.setSdCardPage(n)}
        getCompressedImageBytes={() => store.downloadSdCardImage()}>
        
        <Filesystem
            fileList={filesystem.fileList}
            selectedFile={filesystem.selectedFile?.filename}
            selectedFileSize={filesystem.selectedFile?.size}
            selectedPage={filesystem.selectedPage}
            pageContents={filesystem.pageContents}
            onUpdate={(filename, page) => filesystem.updateFromEmulator(filename, page)}
        />

    </SDCard>
});

export default SDCardPage;
