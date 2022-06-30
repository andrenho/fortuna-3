import {observer} from "mobx-react-lite";
import useStore from "../../hooks/useStore";
import {StyleSet} from "../../util/types";

const style: StyleSet = {
    files: {
        display: "flex",
        flexDirection: "column",
        width: "140px",
    },
    file: {
        fontSize: "14px",
        border: "1px black solid",
        borderRight: 0,
        borderBottom: 0,
        padding: "2px 8px",
        cursor: "pointer",
        boxShadow: "6px 6px 6px lightgray",
        backgroundColor: "white",
        height: "16px",
    },
};

type FileChooserProps = {
    selectedFile: string | undefined,
    onSelectFile: (filename: string) => void;
};

const FileChooser = observer((props: FileChooserProps) : JSX.Element => {

    const { currentProject } = useStore();

    return (<div style={style.files}>
        { currentProject && Object.keys(currentProject!.source).map((filename, i) => (
            <div
                style={{
                    ...style.file,
                    ...(i === Object.keys(currentProject!.source).length - 1) ? {borderBottom: "1px black solid"} : undefined,
                    ...(filename === props.selectedFile) ? {backgroundColor: "aquamarine"} : undefined,
                }}
                key={`fc_${filename}`}
                onClick={() => props.onSelectFile(filename)}>
                { filename }
            </div>)) }
    </div>);
});

export default FileChooser;
