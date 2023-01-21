import Box from "components/common/Box/Box";
import css from "./FortunaPi.module.scss";

const FortunaPi : React.FC = () => {
    return <Box title="Fortuna-Pi">
        <canvas className={css.fortunaPi} width={640} height={400} id="fortuna-pi" />
    </Box>;
}

export default FortunaPi;