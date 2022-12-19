import {observer} from "mobx-react-lite";
import css from "./FileChooser.module.scss";
import React from "react";

type FileChooserProps = {
    selectedFile: string | undefined,
    onSelectFile: (filename: string) => void;
    fileList: string[];
};

const FileChooser : React.FC<FileChooserProps> = observer(({selectedFile, onSelectFile, fileList}) => {

    return <div className={css.files}>
        { fileList.map((filename, i) =>
            <div
                className={css.file}
                style={{
                    ...(i === fileList.length - 1) ? {borderBottom: "1px black solid"} : undefined,
                    ...(filename === selectedFile) ? {backgroundColor: "aquamarine"} : undefined,
                }}
                key={`fc_${filename}`}
                onClick={() => onSelectFile(filename)}>
                { filename }
            </div>
        ) }
    </div>;
});

export default FileChooser;
