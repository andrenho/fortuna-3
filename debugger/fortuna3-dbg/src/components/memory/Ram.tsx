import React from "react";
import {observer} from "mobx-react-lite";
import FlatData, {Highlights} from "components/common/FlatData";
import useStore from "hooks/useStore";
import Stack from "./Stack";
import MemoryBanks from "./MemoryBanks";

const RAM : React.FC = observer(() => {

    const store = useStore();
    const state = store.state!;

    const highlights : Highlights = {};

    if (state.cpu.pc >= (store.ramPage * 256) && state.cpu.pc < ((store.ramPage + 1) * 256))
        highlights[state.cpu.pc - (store.ramPage * 256)] = "lightblue";

    return <FlatData
            title="RAM"
            currentPage={store.ramPage}
            totalPages={256}
            rows={16}
            bytes={state?.ramPage!}
            highlightOffset={highlights}
            onPageChange={(n) => store.setRamPage(n)}
        >
            <Stack />
            <MemoryBanks />
        </FlatData>;

});

export default RAM;