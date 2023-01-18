import React from "react";
import Options from "store/types/options";
import Box from "components/common/box/Box";

type CompilerOptionsProps = {
    options: Options,
    onUpdate: (opt: Options) => void,
}

const CompilerOptions : React.FC<CompilerOptionsProps> = ({ options, onUpdate }) => {
    return <Box title="Compiler options">
        <input
            type="checkbox"
            value="Collapse macros"
            name="collapseMacros"
            checked={options.collapseMacros}
            onClick={() => onUpdate({ collapseMacros: !options.collapseMacros }) }
        />
        <label htmlFor="collapseMacros">Collapse macros</label>
    </Box>;
};

export default CompilerOptions;