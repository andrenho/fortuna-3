import {observer} from "mobx-react-lite";
import useStore from "hooks/useStore";
import FlatData from "components/common/flat-data/FlatData";
import SDCardImageDownloader from "./SDCardImageDownloader";

const SDCard : React.FC = observer(() => {

    const store = useStore();
    const state = store.state!;

    if (store.debuggingInfo != null)
        return <FlatData
            title="SD Card"
            currentPage={store.sdCardPage}
            totalPages={store.debuggingInfo.sdCardSizeInMB * 2048}
            rows={32}
            bytes={state?.sdCardPage!}
            onPageChange={n => store.setSdCardPage(n)}
            topRightElement={<SDCardImageDownloader />}
        />;
    else
        return <></>;
});

export default SDCard;