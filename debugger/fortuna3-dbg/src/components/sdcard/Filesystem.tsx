import FlatData from "components/common/flat-data/FlatData";
import css from "./Filesystem.module.scss";

export enum FileType { File, Directory };

type FFile = {
    filename: string,
    fileType: FileType,
    size?: number,
}

type FilesystemProps = {
    fileList: FFile[],
    selectedFile?: string;
    selectedPage: number;
    pageContents?: Uint8Array,
    onFileSelect: (filename: string) => void;
    onPageChange: (newPage: number) => void;
}

const Filesystem : React.FC<FilesystemProps> = ({fileList, selectedFile, selectedPage, pageContents, onFileSelect, onPageChange}) => {

    const onSelectFile = (filename: string) => {
        onPageChange(1);
        onFileSelect(filename);
    };

    const selectedFileSize = 0;  // TODO

    return <div>
        <div className={css.filelist}>
            { 
                fileList.map(file => {
                    let cssClass = `${css.file} `;
                    if (file.filename === selectedFile)
                        cssClass += css.selectedFile;
                    return <div className={cssClass} onClick={() => onSelectFile(file.filename)}>
                        { file.filename }
                    </div>;
                })
            }
        </div>

        { pageContents && 
            <FlatData
                currentPage={selectedPage}
                totalPages={selectedFileSize / 256}
                rows={16}
                bytes={pageContents}
                onPageChange={onPageChange}
            />
        }
    </div>;
};

export default Filesystem;