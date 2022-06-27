import {observer} from "mobx-react-lite";
import useStore from "../../hooks/useStore";
import FlatData from "../common/FlatData";
import SDCardImageDownloader from "./SDCardImageDownloader";

const SDCard = observer(() : JSX.Element => {

    const store = useStore();
    const state = store.state!;

    return (<FlatData
        title="SD Card"
        currentPage={store.sdCardPage}
        totalPages={store.sdCardSizeInMB * 2048}
        rows={32}
        data={state?.sdCardPage!}
        onPageChange={n => store.setSdCardPage(n)}
        topRightElement={<SDCardImageDownloader />}
    />);
});

export default SDCard;