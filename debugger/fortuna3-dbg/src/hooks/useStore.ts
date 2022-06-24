import {useContext} from "react";
import {FortunaContext} from "../store/fortunaStore";

const useStore = () => useContext(FortunaContext);
export default useStore;