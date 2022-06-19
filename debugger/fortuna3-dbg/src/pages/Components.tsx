import Box from "../components/Box";
import FlatData from "../components/FlatData";
import {useEffect} from "react";

const data = new Uint8Array(64 * 1024);

export default function Components() : JSX.Element {
    useEffect(() => {
        window.crypto.getRandomValues(data);
    }, []);

    return <FlatData title="RAM" currentPage={0} totalPages={256} rows={16} data={data} onPageChange={() => {}} />;
}