import {observer} from "mobx-react-lite";
import useStore from "hooks/useStore";
import css from "./FileChooser.module.scss";

type FileChooserProps = {
    selectedFile: string | undefined,
    onSelectFile: (filename: string) => void;
};

const FileChooser : React.FC<FileChooserProps> = observer(({selectedFile, onSelectFile}) => {

    const { currentProject } = useStore();

    return <div className={css.files}>
        { currentProject && Object.keys(currentProject!.source).map((filename, i) =>
            <div
                className={css.file}
                style={{
                    ...(i === Object.keys(currentProject!.source).length - 1) ? {borderBottom: "1px black solid"} : undefined,
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
