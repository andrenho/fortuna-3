import React, {useState} from "react";
import {observer} from "mobx-react-lite";
import FlatData from "./FlatData";
import useStore from "../hooks/useStore";

const RAM = observer(() : JSX.Element => {

    const store = useStore();

    return (
        <FlatData
            title="RAM"
            currentPage={store.ramPage}
            totalPages={256}
            rows={16}
            data={store.state?.ramPage!}
            onPageChange={(n) => store.setRamPage(n)}
        >

        </FlatData>
    );

});

export default RAM;