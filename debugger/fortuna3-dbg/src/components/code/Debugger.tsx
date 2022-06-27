import FileChooser from "./FileChooser";
import Code from "./Code";
import useStore from "../../hooks/useStore";
import {observer} from "mobx-react-lite";

const Debugger = observer(() : JSX.Element => {

    const store = useStore();

    return (<div style={{display: "flex", marginBottom: "16px"}}>
        <FileChooser selectedFile={store.selectedFile} onSelectFile={(name) => store.setSelectedFile(name)} />
        <Code selectedFile={store.selectedFile} />
    </div>);
});

export default Debugger;