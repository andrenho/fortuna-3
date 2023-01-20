import React from 'react';
import {observer} from "mobx-react-lite";
import SDCard from "components/sdcard/SDCard/SDCard";
import useStore from 'hooks/useStore';
import Filesystem from 'components/sdcard/Filesystem/Filesystem';

const SDCardPage : React.FC = observer(() => {

    const store = useStore();
    const filesystem = store.filesystem!;

    if (store.debuggingInfo === undefined)
        return <></>;

    return <SDCard
        currentPage={store.sdCardPage}
        sdCardSizeInMB={store.debuggingInfo.debuggerSetup.sdCardSizeInMB}
        currentPageBytes={store.state.sdCardPage}
        onPageChange={n => store.setSdCardPage(n)}
        getCompressedImageBytes={() => store.downloadSdCardImage()}
        sdCardEjected={filesystem.ejected}
        onSdCardEject={ejected => filesystem.setEjected(ejected)}
    >

        <Filesystem
            currentDirectory={filesystem.currentPath}
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
