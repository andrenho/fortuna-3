import React from "react";
import RemoteOptions from "store/types/remoteOptions";
import Box from "components/common/Box/Box";
import LocalOptions from "store/types/localOptions";

type OptionsProps = {
    localOptions: LocalOptions,
    onUpdateLocalOptions: (opt: LocalOptions) => void,
    remoteOptions: RemoteOptions,
    onUpdateRemote: (opt: RemoteOptions) => void,
}

const Options : React.FC<OptionsProps> = ({ localOptions, onUpdateLocalOptions, remoteOptions, onUpdateRemote }) => {
    return <Box title="Options">
        <div>
            <p><b>Debugger options</b></p>
            <div>
                <input
                    type="checkbox"
                    value="Show bytes"
                    name="showBytes"
                    checked={localOptions.showBytes}
                    onChange={() => onUpdateLocalOptions({ ...localOptions, showBytes: !localOptions.showBytes }) }
                />
                <label htmlFor="showBytes">Show bytes on debugger</label>
            </div>
            <p><b>Compiler options</b></p>
            <div>
                <input
                    type="checkbox"
                    value="Collapse macros"
                    name="collapseMacros"
                    checked={remoteOptions.collapseMacros}
                    onChange={() => onUpdateRemote({ collapseMacros: !remoteOptions.collapseMacros }) }
                />
                <label htmlFor="collapseMacros">Collapse macros</label>
            </div>
        </div>
    </Box>;
};

export default Options;