import FlatData from "components/common/flat-data/FlatData";
import { FFile } from "store/filesystem";
import css from "./Filesystem.module.scss";

type FilesystemProps = {
    fileList: FFile[],
    selectedFile?: string;
    selectedFileSize?: number;
    selectedPage: number;
    pageContents?: Uint8Array,
    onFileSelect: (filename: string) => void;
    onPageChange: (newPage: number) => void;
}

const Filesystem : React.FC<FilesystemProps> = ({fileList, selectedFile, selectedFileSize, selectedPage, pageContents, onFileSelect, onPageChange}) => {

    const onSelectFile = (filename: string) => {
        onPageChange(0);
        onFileSelect(filename);
    };

    return <div className={css.main}>
        <div className={css.filelist}>
            { 
                fileList.map(file => {
                    let cssClass = `${css.file} `;
                    if (file.filename === selectedFile)
                        cssClass += css.selectedFile;
                    return <div key={`file_${file.filename}`} className={cssClass} onClick={() => onSelectFile(file.filename)}>
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
                onPageChange={onPageChange}
            />
        }
    </div>;
};

export default Filesystem;