import React from "react";
import {observer} from "mobx-react-lite";
import FlatData, {Highlights} from "components/common/flat-data/FlatData";
import Stack from "./Stack";
import MemoryBanks from "./MemoryBanks";

type RAMProps = {
    pc: number;
    ramPage: number;
    bytes: Uint8Array;
    stack: Uint8Array;
    ramBank: number;
    onPageChange: (n: number) => void;
}

const RAM : React.FC<RAMProps> = observer(({pc, ramPage, bytes, stack, ramBank, onPageChange}) => {

    const highlights : Highlights = {};

    if (pc >= (ramPage * 256) && pc < ((ramPage + 1) * 256))
        highlights[pc - (ramPage * 256)] = "lightblue";

    return <FlatData
            title="RAM"
            currentPage={ramPage}
            totalPages={256}
            rows={16}
            bytes={bytes}
            highlightOffset={highlights}
            onPageChange={onPageChange}
        >
            <Stack stack={stack} />
            <MemoryBanks ramBank={ramBank} bankCount={8} />
        </FlatData>;

});

export default RAM;