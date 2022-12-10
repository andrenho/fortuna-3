import FlatData from "components/common/flat-data/FlatData";
import { observer } from "mobx-react-lite";
import { FileType } from "fortuna3-emu";
import css from "./Filesystem.module.scss";

type FFile = {
    filename: string,
    fileType: FileType,
}

type FilesystemProps = {
    fileList: FFile[],
    selectedFile?: string;
    selectedFileSize?: number;
    selectedPage: number;
    pageContents?: Uint8Array,
    onUpdate: (filename: string | undefined, newPage: number) => void;
}

const Filesystem : React.FC<FilesystemProps> = observer(({fileList, selectedFile, selectedFileSize, selectedPage, pageContents, onUpdate}) => {

    return <div className={css.main}>
        <div className={css.filelist}>
            { 
                fileList.map(file => {
                    let cssClass = `${css.file} `;
                    if (file.filename === selectedFile)
                        cssClass += css.selectedFile;
                    return <div key={`file_${file.filename}`} className={cssClass} onClick={() => onUpdate(file.filename, 0)}>
                        { file.filename }
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