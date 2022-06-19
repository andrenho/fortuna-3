import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import FlatData, {Highlights} from "./FlatData";
import useStore from "../hooks/useStore";

const RAM = observer(() : JSX.Element => {

    const store = useStore();
    const state = store.state!;

    const highlights : Highlights = {};

    if (state.cpu.pc >= (store.ramPage * 256) && state.cpu.pc < ((store.ramPage + 1) * 256))
        highlights[state.cpu.pc - (store.ramPage * 256)] = "lightblue";

    return (
        <FlatData
            title="RAM"
            currentPage={store.ramPage}
            totalPages={256}
            rows={16}
            data={state?.ramPage!}
            highlightOffset={highlights}
            onPageChange={(n) => store.setRamPage(n)}
        >

        </FlatData>
    );

});

export default RAM;