import FlatData, {Highlights} from "../components/FlatData";
import {useState} from "react";

const data = new Uint8Array(64 * 1024);
window.crypto.getRandomValues(data);

export default function Components() : JSX.Element {

    const [page, setPage] = useState(0);
    const highlight : Highlights = {
        "4": "yellow",
        "6": "lightgreen",
    };

    return (
        <FlatData
            title="RAM"
            currentPage={page}
            totalPages={256}
            rows={16}
            data={data.slice(page * 16, page * 16 + 256)}
            highlightOffset={highlight}
            onPageChange={(n) => setPage(n)}
        >

        </FlatData>
    );
}