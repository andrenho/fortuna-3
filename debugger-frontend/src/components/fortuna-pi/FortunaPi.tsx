import Box from "components/common/Box/Box";
import css from "./FortunaPi.module.scss";

const FortunaPi : React.FC = () => {
    return <Box title="Fortuna-Pi">
        <canvas className={css.fortunaPi} width={240} height={270} id="canvas" onContextMenu={e => e.preventDefault()} />
    </Box>;
}

export default FortunaPi;