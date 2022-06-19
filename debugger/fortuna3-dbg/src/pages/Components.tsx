import Box from "../components/Box";
import FlatData from "../components/FlatData";

export default function Components() : JSX.Element {
    const data = new Uint8Array(256);
    return <FlatData title="RAM" currentPage={0} totalPages={256} rows={16} data={data} onPageChange={() => {}} />;
}