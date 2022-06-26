import FileChooser from "./FileChooser";
import Code from "./Code";
import {useState} from "react";

const Debugger = () : JSX.Element => {

    const [selectedFile, setSelectedFile] = useState("");

    return (<div style={{display: "flex", marginBottom: "16px"}}>
        <FileChooser selectedFile={selectedFile} onSelectFile={(name) => setSelectedFile(name)} />
        <Code />
    </div>);
};

export default Debugger;