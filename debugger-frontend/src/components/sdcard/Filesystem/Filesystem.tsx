import FlatData from "components/common/FlatData/FlatData";
import {observer} from "mobx-react-lite";
import css from "components/sdcard/Filesystem/Filesystem.module.scss";
import {FileType} from "api/fortuna3-emulator";
import React from "react";

type FFile = {
    filename: string,
    fileType: FileType,
}

type FilesystemProps = {
    currentDirectory: string,
    fileList: FFile[],
    selectedFile?: string;
    selectedFileSize?: number;
    selectedPage: number;
    pageContents?: Uint8Array,
    onUpdate: (filename: string | undefined, newPage: number) => void;
}

const Filesystem : React.FC<FilesystemProps> = observer(({currentDirectory, fileList, selectedFile, selectedFileSize, selectedPage, pageContents, onUpdate}) => {

    const fileSort = (a: FFile, b: FFile) : number  => {
        let n = a.filename.localeCompare(b.filename);
        n += (b.fileType - a.fileType) * 1000;
        return n;
    }

    return <div className={css.main}>
        <div>Dir: <b>{ currentDirectory }</b></div>
        <div className={css.filelist}>
            { 
                fileList.slice().sort(fileSort).map(file => {
                    let cssClass = `${css.file} `;
                    if (file.filename === selectedFile)
                        cssClass += css.selectedFile;
                    return <div key={`file_${file.filename}`} className={cssClass} onClick={() => onUpdate(file.filename, 0)}>
                        { file.fileType === FileType.Directory ? `[${file.filename}]` : file.filename }
                    </div>;
                })
            }
        </div>

        { pageContents && 
            <FlatData
                currentPage={selectedPage}
                totalPages={Math.ceil(selectedFileSize! / 256)}
                rows={16}
                bytes={pageContents}
                onPageChange={(page) => onUpdate(selectedFile, page)}
            />
        }
    </div>;
});

export default Filesystem;